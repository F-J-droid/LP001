-- Checkout Idempotency
create table public.checkout_idempotency (
  idempotency_key text primary key,
  order_id uuid not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '1 day')
);

-- Orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  public_id text not null unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_cpf text,
  status text not null check (status in ('pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'expired')),
  payment_status text not null check (payment_status in ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
  payment_method text,
  subtotal_cents integer not null check (subtotal_cents >= 0),
  discount_cents integer not null default 0 check (discount_cents >= 0),
  shipping_cents integer not null default 0 check (shipping_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  currency text not null default 'BRL',
  shipping_method_id text,
  shipping_method_name text,
  shipping_estimated_min_days integer,
  shipping_estimated_max_days integer,
  reservation_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger orders_updated_at before update on public.orders for each row execute procedure public.set_updated_at();
create index idx_orders_public_id on public.orders(public_id);
create index idx_orders_status on public.orders(status);
create index idx_orders_payment_status on public.orders(payment_status);
create index idx_orders_created_at on public.orders(created_at);

-- Foreign key for idempotency linking back to orders
alter table public.checkout_idempotency add constraint fk_idempotency_order foreign key (order_id) references public.orders(id) on delete restrict;

-- Order Items
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  tire_variant_id uuid not null references public.tire_variants(id) on delete restrict,
  sku text not null,
  product_name text not null,
  size_label text,
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  subtotal_cents integer not null check (subtotal_cents >= 0),
  created_at timestamptz not null default now()
);
create index idx_order_items_order_id on public.order_items(order_id);
create index idx_order_items_variant_id on public.order_items(tire_variant_id);

-- Order Addresses
create table public.order_addresses (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  recipient_name text not null,
  postal_code text not null,
  street text not null,
  number text not null,
  complement text,
  district text not null,
  city text not null,
  state text not null,
  created_at timestamptz not null default now()
);
create index idx_order_addresses_order_id on public.order_addresses(order_id);

-- Order Status History
create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  from_status text check (from_status in ('pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'expired')),
  to_status text not null check (to_status in ('pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'expired')),
  created_by uuid references auth.users(id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);
create index idx_order_status_history_order_id on public.order_status_history(order_id);
create index idx_order_status_history_created_at on public.order_status_history(created_at);
