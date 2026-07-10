-- ============================================================
-- Wear Floral — Multi image support (003)
-- Run AFTER 002_revamp.sql
-- ============================================================

alter table public.products
  add column if not exists image_paths text[] not null default '{}',
  add column if not exists thumbnail_index integer not null default 0;

-- Backfill existing rows from legacy single image_path
update public.products
set image_paths = case
  when image_path is not null and image_path <> '' then array[image_path]
  else '{}'
end
where image_paths = '{}'::text[];

update public.products
set thumbnail_index = 0
where thumbnail_index is null or thumbnail_index < 0;

