# Supabase Setup — Wear Floral

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Choose a name, set a database password, pick a region close to Pakistan

## 2. Run Migrations (in order)

1. **SQL Editor** → New query → paste `supabase/migrations/001_schema.sql` → Run
2. **SQL Editor** → New query → paste `supabase/migrations/002_revamp.sql` → Run

> Migration 002 drops and recreates tables with the new unstitched-fabric schema.

## 3. Add Admin User

1. **Authentication → Users → Add user**
2. Email: `saleswearfloral@gmail.com` + strong password
3. Edit user → **User Metadata**:

```json
{ "is_admin": true }
```

## 4. Configure Environment

Copy `.env.local.example` to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 5. Storage Bucket

Migration 002 creates the `product-images` bucket automatically. Verify in **Storage** that it exists and is public.

## 6. Test

- Store: `npm run dev` → browse `/shop` (empty until admin adds products)
- Admin: `/admin/login` with admin credentials
- Customer: sign up at `/signup`, add items to cart, checkout at `/checkout`

## Tables

| Table | Purpose |
|---|---|
| `products` | Unstitched fabric pieces (unique, one-of-a-kind) |
| `profiles` | Customer name, phone, address, city |
| `orders` | Customer orders with status tracking |
| `order_items` | Line items per order (with purchase price for profit) |
| `product-images` (storage) | Product photos uploaded by admin |
