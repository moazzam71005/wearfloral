-- Fix guest checkout: order_items insert was blocked because anon
-- cannot SELECT orders (RLS), so EXISTS in WITH CHECK always failed.
-- Run this in Supabase SQL Editor.

create or replace function public.can_insert_order_items(oid text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.orders o
    where o.id = oid
      and (
        o.customer_id is null
        or o.customer_id = auth.uid()
        or public.is_admin()
      )
  );
$$;

drop policy if exists "order_items_insert" on public.order_items;

create policy "order_items_insert"
  on public.order_items for insert to anon, authenticated
  with check (public.can_insert_order_items(order_id));
