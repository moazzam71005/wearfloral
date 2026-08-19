-- Bedsheets category on products (existing rows stay unstitched fabric)
-- Run in Supabase SQL Editor after 006_fix_guest_order_items.sql

alter table public.products
  add column if not exists category text not null default 'fabric'
  check (category in ('fabric', 'bedsheet'));

create index if not exists products_category_idx on public.products(category);
