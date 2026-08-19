-- Funções de Reserva de Estoque e Checkout Transacional

-- 1. Criação de Pedido Pendente (Atomic, Idempotent, Safe)
CREATE OR REPLACE FUNCTION public.create_pending_order(payload jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_idempotency_key text;
  v_customer jsonb;
  v_address jsonb;
  v_items jsonb;
  v_shipping_cents int;
  v_shipping_method_id text;
  v_shipping_method_name text;
  v_shipping_min int;
  v_shipping_max int;
  v_existing_order_id uuid;
  
  v_public_id text;
  v_new_order_id uuid;
  v_item jsonb;
  v_variant_id uuid;
  v_qty int;
  
  v_db_price int;
  v_db_active boolean;
  v_db_sku text;
  v_db_model_name text;
  v_db_brand_name text;
  v_db_size_width int;
  v_db_size_profile int;
  v_db_size_rim int;
  v_available_qty int;
  
  v_subtotal int := 0;
  v_total int := 0;
  
  v_item_expected_price int;
  v_item_subtotal int;
  
  v_collision_count int := 0;
BEGIN
  -- 1. Idempotency Check
  v_idempotency_key := payload->>'idempotencyKey';
  IF v_idempotency_key IS NULL THEN
    RAISE EXCEPTION 'Idempotency key is required';
  END IF;

  SELECT order_id INTO v_existing_order_id FROM public.checkout_idempotency WHERE idempotency_key = v_idempotency_key;
  IF FOUND THEN
    -- Return existing order details idempotently
    RETURN (SELECT row_to_json(o) FROM public.orders o WHERE id = v_existing_order_id);
  END IF;

  -- 2. Extract payload
  v_customer := payload->'customer';
  v_address := payload->'address';
  v_items := payload->'items';
  
  -- The trusted node server computed this:
  v_shipping_cents := (payload->>'shippingCents')::int;
  v_shipping_method_id := payload->>'shippingMethodId';
  v_shipping_method_name := payload->>'shippingMethodName';
  v_shipping_min := (payload->>'shippingMinDays')::int;
  v_shipping_max := (payload->>'shippingMaxDays')::int;

  -- 3. Lock Inventory Deterministically
  -- To avoid deadlocks when concurrent checkouts try to lock the same variants in different orders,
  -- we lock them sorted by their uuid.
  FOR v_variant_id IN 
    SELECT (jsonb_array_elements(v_items)->>'productId')::uuid AS vid 
    ORDER BY vid 
  LOOP
    PERFORM 1 FROM public.inventory WHERE tire_variant_id = v_variant_id FOR UPDATE;
  END LOOP;

  v_new_order_id := gen_random_uuid();

  -- 4. Validate Items, Check Availability and Calculate Totals
  FOR v_item IN SELECT * FROM jsonb_array_elements(v_items)
  LOOP
    v_variant_id := (v_item->>'productId')::uuid;
    v_qty := (v_item->>'quantity')::int;
    v_item_expected_price := (v_item->>'expectedPriceCents')::int;

    IF v_qty <= 0 THEN
      RAISE EXCEPTION 'INVALID_QUANTITY';
    END IF;

    -- Get variant details. Note: we prioritize regular_price_cents for now, or pix_price_cents if the frontend passed it?
    -- The prompt said: "Preço vem do banco... se payment_method = pix, pode usar pix_price_cents se essa regra já existir."
    -- In Phase 8.2, pix_price_cents is in prices table. For simplicity, we compare with the sale/pix price.
    SELECT 
      v.sku, v.is_active, 
      COALESCE(p.pix_price_cents, p.sale_price_cents, p.regular_price_cents),
      i.quantity - i.reserved_quantity
    INTO 
      v_db_sku, v_db_active, v_db_price, v_available_qty
    FROM public.tire_variants v
    JOIN public.prices p ON p.tire_variant_id = v.id
    JOIN public.inventory i ON i.tire_variant_id = v.id
    WHERE v.id = v_variant_id;

    IF NOT FOUND OR NOT v_db_active THEN
      RAISE EXCEPTION 'INVALID_PRODUCT';
    END IF;

    IF v_available_qty < v_qty THEN
      RAISE EXCEPTION 'OUT_OF_STOCK';
    END IF;

    IF v_db_price != v_item_expected_price THEN
      RAISE EXCEPTION 'PRICE_CHANGED';
    END IF;

    v_item_subtotal := v_db_price * v_qty;
    v_subtotal := v_subtotal + v_item_subtotal;

    -- Update inventory reservation immediately (we hold the lock)
    UPDATE public.inventory 
    SET reserved_quantity = reserved_quantity + v_qty, updated_at = now()
    WHERE tire_variant_id = v_variant_id;
  END LOOP;

  v_total := v_subtotal + v_shipping_cents;

  -- 5. Create Order with Retry for Public ID
  LOOP
    v_public_id := 'PED-' || to_char(now() AT TIME ZONE 'UTC', 'YYYYMMDD') || '-' || upper(substring(md5(random()::text) from 1 for 8));
    BEGIN
      INSERT INTO public.orders (
        id, public_id, customer_name, customer_email, customer_phone, customer_cpf,
        status, payment_status, subtotal_cents, discount_cents, shipping_cents, total_cents,
        shipping_method_id, shipping_method_name, shipping_estimated_min_days, shipping_estimated_max_days,
        reservation_expires_at
      ) VALUES (
        v_new_order_id, v_public_id, v_customer->>'name', v_customer->>'email', v_customer->>'phone', v_customer->>'cpf',
        'pending_payment', 'pending', v_subtotal, 0, v_shipping_cents, v_total,
        v_shipping_method_id, v_shipping_method_name, v_shipping_min, v_shipping_max,
        now() + interval '30 minutes'
      );
      EXIT; -- Success, exit loop
    EXCEPTION WHEN unique_violation THEN
      v_collision_count := v_collision_count + 1;
      IF v_collision_count > 5 THEN
        RAISE EXCEPTION 'INTERNAL_ERROR';
      END IF;
    END;
  END LOOP;

  -- 6. Insert Order Items (Requires a second pass over JSON since order is now created)
  FOR v_item IN SELECT * FROM jsonb_array_elements(v_items)
  LOOP
    v_variant_id := (v_item->>'productId')::uuid;
    v_qty := (v_item->>'quantity')::int;
    v_item_expected_price := (v_item->>'expectedPriceCents')::int;

    SELECT 
      v.sku, m.name, b.name, s.width, s.profile, s.rim
    INTO 
      v_db_sku, v_db_model_name, v_db_brand_name, v_db_size_width, v_db_size_profile, v_db_size_rim
    FROM public.tire_variants v
    JOIN public.tire_models m ON v.tire_model_id = m.id
    JOIN public.tire_brands b ON m.brand_id = b.id
    JOIN public.tire_sizes s ON v.tire_size_id = s.id
    WHERE v.id = v_variant_id;

    INSERT INTO public.order_items (
      order_id, tire_variant_id, sku, product_name, size_label, quantity, unit_price_cents, subtotal_cents
    ) VALUES (
      v_new_order_id, v_variant_id, v_db_sku, 
      v_db_brand_name || ' ' || v_db_model_name,
      v_db_size_width || '/' || v_db_size_profile || ' R' || v_db_size_rim,
      v_qty, v_item_expected_price, v_qty * v_item_expected_price
    );
  END LOOP;

  -- 7. Insert Address
  INSERT INTO public.order_addresses (
    order_id, recipient_name, postal_code, street, number, complement, district, city, state
  ) VALUES (
    v_new_order_id,
    v_address->>'recipientName',
    v_address->>'postalCode',
    v_address->>'street',
    v_address->>'number',
    v_address->>'complement',
    v_address->>'district',
    v_address->>'city',
    v_address->>'state'
  );

  -- 8. Record History
  INSERT INTO public.order_status_history (order_id, to_status, note)
  VALUES (v_new_order_id, 'pending_payment', 'Order created via checkout');

  -- 9. Idempotency Record
  INSERT INTO public.checkout_idempotency (idempotency_key, order_id)
  VALUES (v_idempotency_key, v_new_order_id);

  -- Return the created order
  RETURN (SELECT row_to_json(o) FROM public.orders o WHERE id = v_new_order_id);
END;
$$;


-- 2. Cancelamento Transacional
CREATE OR REPLACE FUNCTION public.cancel_pending_order(p_order_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_status text;
  v_item record;
BEGIN
  -- Lock the order row
  SELECT status INTO v_status FROM public.orders WHERE id = p_order_id FOR UPDATE;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'ORDER_NOT_FOUND';
  END IF;

  IF v_status = 'cancelled' THEN
    -- Idempotent cancel
    RETURN (SELECT row_to_json(o) FROM public.orders o WHERE id = p_order_id);
  END IF;

  IF v_status != 'pending_payment' THEN
    RAISE EXCEPTION 'ORDER_NOT_PENDING';
  END IF;

  -- Release reserved quantities. Must lock inventory rows deterministically if concurrent cancellations occur,
  -- but since order_items list is fixed per order and we sort by tire_variant_id, we avoid deadlocks.
  FOR v_item IN 
    SELECT tire_variant_id, quantity FROM public.order_items WHERE order_id = p_order_id ORDER BY tire_variant_id
  LOOP
    -- Lock explicitly to be safe
    PERFORM 1 FROM public.inventory WHERE tire_variant_id = v_item.tire_variant_id FOR UPDATE;
    
    UPDATE public.inventory
    SET reserved_quantity = greatest(0, reserved_quantity - v_item.quantity), updated_at = now()
    WHERE tire_variant_id = v_item.tire_variant_id;
  END LOOP;

  -- Update order status
  UPDATE public.orders
  SET status = 'cancelled', payment_status = 'cancelled', updated_at = now()
  WHERE id = p_order_id;

  -- Record History
  INSERT INTO public.order_status_history (order_id, from_status, to_status, note)
  VALUES (p_order_id, v_status, 'cancelled', 'Order cancelled');

  RETURN (SELECT row_to_json(o) FROM public.orders o WHERE id = p_order_id);
END;
$$;


-- 3. Expiração Batch de Pedidos Pendentes
CREATE OR REPLACE FUNCTION public.expire_pending_orders()
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_order record;
  v_count int := 0;
BEGIN
  FOR v_order IN 
    SELECT id FROM public.orders 
    WHERE status = 'pending_payment' 
    AND reservation_expires_at < now()
    FOR UPDATE SKIP LOCKED
  LOOP
    PERFORM public.cancel_pending_order(v_order.id);
    v_count := v_count + 1;
  END LOOP;
  RETURN v_count;
END;
$$;

-- GRANTS explícitos
-- Remove default grants from public
REVOKE EXECUTE ON FUNCTION public.create_pending_order(jsonb) FROM public;
REVOKE EXECUTE ON FUNCTION public.create_pending_order(jsonb) FROM anon;
REVOKE EXECUTE ON FUNCTION public.create_pending_order(jsonb) FROM authenticated;

REVOKE EXECUTE ON FUNCTION public.cancel_pending_order(uuid) FROM public;
REVOKE EXECUTE ON FUNCTION public.cancel_pending_order(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.cancel_pending_order(uuid) FROM authenticated;

REVOKE EXECUTE ON FUNCTION public.expire_pending_orders() FROM public;
REVOKE EXECUTE ON FUNCTION public.expire_pending_orders() FROM anon;
REVOKE EXECUTE ON FUNCTION public.expire_pending_orders() FROM authenticated;

-- Apenas o service_role ou o backend do Node (via service_role secret) deve conseguir chamar essas funções
-- Como estamos usando o Supabase Admin Client, o role 'service_role' precisa ter permissão
GRANT EXECUTE ON FUNCTION public.create_pending_order(jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.cancel_pending_order(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.expire_pending_orders() TO service_role;
