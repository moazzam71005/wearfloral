-- ============================================================
-- Wear Floral — Supabase Database Migration
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PRODUCTS
-- ============================================================
create table if not exists public.products (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  slug          text not null unique,
  description   text,
  material      text,
  care          text,
  shipping      text,
  category      text not null,
  brand         text,
  price         numeric(10,2) not null,
  compare_at_price numeric(10,2),
  images        text[] not null default '{}',
  colors        text[] not null default '{}',
  sizes         text[] not null default '{}',
  stock         integer not null default 0,
  low_stock_threshold integer not null default 5,
  sku           text,
  is_new_arrival boolean not null default false,
  is_best_seller boolean not null default false,
  rating        numeric(3,1) not null default 0,
  review_count  integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ============================================================
-- CUSTOMERS
-- ============================================================
create table if not exists public.customers (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  email         text not null unique,
  phone         text,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- ORDERS
-- ============================================================
create table if not exists public.orders (
  id              text primary key,  -- e.g. ORD-1001
  customer_id     uuid references public.customers(id) on delete set null,
  customer_name   text not null,
  customer_email  text not null,
  customer_phone  text,
  shipping_address text,
  city            text,
  subtotal        numeric(10,2) not null default 0,
  shipping_fee    numeric(10,2) not null default 0,
  total           numeric(10,2) not null default 0,
  status          text not null default 'Pending'
                  check (status in ('Pending','Processing','Shipped','Delivered','Cancelled')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ============================================================
-- ORDER ITEMS
-- ============================================================
create table if not exists public.order_items (
  id          uuid primary key default uuid_generate_v4(),
  order_id    text not null references public.orders(id) on delete cascade,
  product_id  uuid references public.products(id) on delete set null,
  name        text not null,
  image       text,
  price       numeric(10,2) not null,
  size        text,
  color       text,
  quantity    integer not null default 1
);

-- ============================================================
-- INVENTORY
-- ============================================================
create table if not exists public.inventory (
  id                  uuid primary key default uuid_generate_v4(),
  product_id          uuid not null references public.products(id) on delete cascade,
  sku                 text not null,
  size                text not null,
  stock               integer not null default 0,
  low_stock_threshold integer not null default 5,
  updated_at          timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Products: public read, admin write
alter table public.products enable row level security;

create policy "products_public_read"
  on public.products for select
  to anon, authenticated
  using (true);

create policy "products_admin_insert"
  on public.products for insert
  to authenticated
  with check (
    (auth.jwt() ->> 'role') = 'admin'
    or (auth.jwt() -> 'user_metadata' ->> 'is_admin') = 'true'
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

create policy "products_admin_update"
  on public.products for update
  to authenticated
  using (
    (auth.jwt() ->> 'role') = 'admin'
    or (auth.jwt() -> 'user_metadata' ->> 'is_admin') = 'true'
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

create policy "products_admin_delete"
  on public.products for delete
  to authenticated
  using (
    (auth.jwt() ->> 'role') = 'admin'
    or (auth.jwt() -> 'user_metadata' ->> 'is_admin') = 'true'
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Orders: admin only
alter table public.orders enable row level security;

create policy "orders_admin_all"
  on public.orders for all
  to authenticated
  using (
    (auth.jwt() -> 'user_metadata' ->> 'is_admin') = 'true'
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Order items: admin only
alter table public.order_items enable row level security;

create policy "order_items_admin_all"
  on public.order_items for all
  to authenticated
  using (
    (auth.jwt() -> 'user_metadata' ->> 'is_admin') = 'true'
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Inventory: admin only
alter table public.inventory enable row level security;

create policy "inventory_admin_all"
  on public.inventory for all
  to authenticated
  using (
    (auth.jwt() -> 'user_metadata' ->> 'is_admin') = 'true'
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Customers: admin only
alter table public.customers enable row level security;

create policy "customers_admin_all"
  on public.customers for all
  to authenticated
  using (
    (auth.jwt() -> 'user_metadata' ->> 'is_admin') = 'true'
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
