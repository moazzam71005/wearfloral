-- Guest WhatsApp checkout: no customer account required.
-- Run in Supabase SQL Editor after 003_multi_images.sql

-- Allow orders without a linked auth user
alter table public.orders
  alter column customer_id drop not null;

-- Shop must show available + sold-out pieces to everyone
drop policy if exists "products_public_read_available" on public.products;
create policy "products_public_read_all"
  on public.products for select to anon, authenticated
  using (true);

-- Replace customer-only insert with guest-friendly insert
drop policy if exists "orders_insert_own" on public.orders;
create policy "orders_insert_guest_or_own"
  on public.orders for insert to anon, authenticated
  with check (
    customer_id is null
    or customer_id = auth.uid()
    or public.is_admin()
  );

-- Guests can insert line items for an order they just created
drop policy if exists "order_items_insert" on public.order_items;
create policy "order_items_insert"
  on public.order_items for insert to anon, authenticated
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (
          o.customer_id is null
          or o.customer_id = auth.uid()
          or public.is_admin()
        )
    )
  );

-- Keep select for customers (own) + admin (all); guests rely on WhatsApp / order id screen
drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own"
  on public.orders for select to authenticated
  using (
    (customer_id is not null and customer_id = auth.uid())
    or public.is_admin()
  );
