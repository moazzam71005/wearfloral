-- ============================================================
-- Wear Floral — Schema Revamp (002)
-- Run AFTER 001_schema.sql in Supabase SQL Editor
-- ============================================================

-- Drop old tables if they exist (from 001)
drop table if exists public.order_items cascade;
drop table if exists public.orders cascade;
drop table if exists public.inventory cascade;
drop table if exists public.customers cascade;
drop table if exists public.products cascade;

-- ============================================================
-- PROFILES (customer data linked to auth.users)
-- ============================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null default '',
  phone       text not null default '',
  address     text not null default '',
  city        text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create profile row on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, phone, address, city)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'address', ''),
    coalesce(new.raw_user_meta_data->>'city', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- PRODUCTS (unique unstitched fabric pieces)
-- ============================================================
create table public.products (
  id              uuid primary key default uuid_generate_v4(),
  product_code    text not null unique,
  name            text not null,
  brand           text not null,
  volume          text not null default '',
  description     text not null default '',
  image_path      text not null default '',
  display_price   numeric(10,2) not null,
  discount_price  numeric(10,2) not null,
  purchase_price  numeric(10,2) not null default 0,
  is_sold         boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create index products_brand_idx on public.products(brand);
create index products_is_sold_idx on public.products(is_sold);

-- ============================================================
-- ORDERS
-- ============================================================
create table public.orders (
  id                text primary key,
  customer_id       uuid not null references auth.users(id) on delete restrict,
  customer_name     text not null,
  customer_email    text not null,
  customer_phone    text not null,
  shipping_address  text not null,
  city              text not null,
  subtotal          numeric(10,2) not null default 0,
  shipping_fee      numeric(10,2) not null default 0,
  total             numeric(10,2) not null default 0,
  status            text not null default 'Pending'
                    check (status in ('Pending','Processing','Shipped','Delivered','Cancelled')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

create index orders_customer_id_idx on public.orders(customer_id);
create index orders_status_idx on public.orders(status);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
create table public.order_items (
  id              uuid primary key default uuid_generate_v4(),
  order_id        text not null references public.orders(id) on delete cascade,
  product_id      uuid references public.products(id) on delete set null,
  name            text not null,
  image_url       text,
  brand           text,
  volume          text,
  display_price   numeric(10,2) not null,
  discount_price  numeric(10,2) not null,
  purchase_price  numeric(10,2) not null default 0
);

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- ============================================================
-- HELPER: is admin check
-- ============================================================
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean,
    false
  ) or coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Profiles
alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select to authenticated
  using (auth.uid() = id or public.is_admin());

create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "profiles_admin_all"
  on public.profiles for all to authenticated
  using (public.is_admin());

-- Products: public read available, admin full access
alter table public.products enable row level security;

create policy "products_public_read_available"
  on public.products for select to anon, authenticated
  using (is_sold = false or public.is_admin());

create policy "products_admin_insert"
  on public.products for insert to authenticated
  with check (public.is_admin());

create policy "products_admin_update"
  on public.products for update to authenticated
  using (public.is_admin());

create policy "products_admin_delete"
  on public.products for delete to authenticated
  using (public.is_admin());

-- Orders: customers see own, admin sees all
alter table public.orders enable row level security;

create policy "orders_select_own"
  on public.orders for select to authenticated
  using (customer_id = auth.uid() or public.is_admin());

create policy "orders_insert_own"
  on public.orders for insert to authenticated
  with check (customer_id = auth.uid());

create policy "orders_admin_update"
  on public.orders for update to authenticated
  using (public.is_admin());

-- Order items
alter table public.order_items enable row level security;

create policy "order_items_select"
  on public.order_items for select to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
      and (o.customer_id = auth.uid() or public.is_admin())
    )
  );

create policy "order_items_insert"
  on public.order_items for insert to authenticated
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
      and o.customer_id = auth.uid()
    )
  );

-- Storage policies
create policy "product_images_public_read"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'product-images');

create policy "product_images_admin_upload"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_admin_update"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_admin_delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());
