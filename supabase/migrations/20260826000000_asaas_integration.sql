-- Add Asaas integration columns to orders table
ALTER TABLE public.orders ADD COLUMN external_payment_id text;
ALTER TABLE public.orders ADD COLUMN external_customer_id text;
ALTER TABLE public.orders ADD COLUMN payment_url text;

-- Update create_pending_order to allow passing payment_method if needed
-- We can actually just update the existing function or not. It's probably easier to update the order in a separate step after create_pending_order returns.
-- So no function changes are strictly necessary right now for create_pending_order, 
-- but let's make sure the type is updated.
