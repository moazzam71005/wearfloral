-- Customer reviews (offline / WhatsApp sales feedback)
-- Run after 004_guest_checkout.sql

create table if not exists public.reviews (
  id              uuid primary key default uuid_generate_v4(),
  customer_name   text not null,
  review_text     text not null,
  rating          int not null check (rating >= 1 and rating <= 5),
  photo_path      text not null default '',
  product_id      uuid references public.products(id) on delete set null,
  is_published    boolean not null default true,
  created_at      timestamptz not null default now()
);

create index if not exists reviews_published_idx on public.reviews(is_published);
create index if not exists reviews_created_at_idx on public.reviews(created_at desc);

insert into storage.buckets (id, name, public)
values ('review-images', 'review-images', true)
on conflict (id) do nothing;

alter table public.reviews enable row level security;

drop policy if exists "reviews_public_read" on public.reviews;
create policy "reviews_public_read"
  on public.reviews for select to anon, authenticated
  using (is_published = true or public.is_admin());

drop policy if exists "reviews_admin_insert" on public.reviews;
create policy "reviews_admin_insert"
  on public.reviews for insert to authenticated
  with check (public.is_admin());

drop policy if exists "reviews_admin_update" on public.reviews;
create policy "reviews_admin_update"
  on public.reviews for update to authenticated
  using (public.is_admin());

drop policy if exists "reviews_admin_delete" on public.reviews;
create policy "reviews_admin_delete"
  on public.reviews for delete to authenticated
  using (public.is_admin());

drop policy if exists "review_images_public_read" on storage.objects;
create policy "review_images_public_read"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'review-images');

drop policy if exists "review_images_admin_upload" on storage.objects;
create policy "review_images_admin_upload"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'review-images' and public.is_admin());

drop policy if exists "review_images_admin_update" on storage.objects;
create policy "review_images_admin_update"
  on storage.objects for update to authenticated
  using (bucket_id = 'review-images' and public.is_admin());

drop policy if exists "review_images_admin_delete" on storage.objects;
create policy "review_images_admin_delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'review-images' and public.is_admin());
