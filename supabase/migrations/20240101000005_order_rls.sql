-- Enable RLS on all order tables
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_addresses enable row level security;
alter table public.order_status_history enable row level security;
alter table public.checkout_idempotency enable row level security;

-- Drop any existing public grants to be sure
REVOKE ALL ON public.orders FROM public;
REVOKE ALL ON public.orders FROM anon;
REVOKE ALL ON public.order_items FROM public;
REVOKE ALL ON public.order_items FROM anon;
REVOKE ALL ON public.order_addresses FROM public;
REVOKE ALL ON public.order_addresses FROM anon;
REVOKE ALL ON public.order_status_history FROM public;
REVOKE ALL ON public.order_status_history FROM anon;

-- Admin read access
create policy "Admins can view all orders" on public.orders for select using (public.is_admin());
create policy "Admins can view all order_items" on public.order_items for select using (public.is_admin());
create policy "Admins can view all order_addresses" on public.order_addresses for select using (public.is_admin());
create policy "Admins can view all order_status_history" on public.order_status_history for select using (public.is_admin());
create policy "Admins can view all checkout_idempotency" on public.checkout_idempotency for select using (public.is_admin());

-- Notice: We do NOT provide an INSERT policy for anon/authenticated for orders!
-- Creating an order MUST be done via the `create_pending_order` RPC which is called via service_role, bypassing RLS.
-- This guarantees nobody can insert a raw record directly into orders from the client.
