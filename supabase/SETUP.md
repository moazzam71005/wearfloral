# Supabase Setup — Wear Floral

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Choose a name, set a database password, pick a region close to Pakistan (e.g. Singapore)

## 2. Run the Migration

1. In your Supabase project → **SQL Editor** → **New query**
2. Paste the contents of `supabase/migrations/001_schema.sql`
3. Click **Run**

## 3. Add Your Admin User

1. Go to **Authentication → Users → Add user**
2. Enter email: `saleswearfloral@gmail.com` and a strong password
3. After creating, click the user → **Edit** → add this to **User Metadata**:

```json
{
  "is_admin": true
}
```

> The frontend checks `user_metadata.is_admin === true` on login.
> You can also set `app_metadata.role = "admin"` via the SQL editor for extra security.

## 4. Set Metadata via SQL (alternative/additional)

```sql
-- Replace <user-id> with the UUID shown in Authentication → Users
update auth.users
set raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
where id = '<user-id>';
```

## 5. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Find these in: **Settings → API → Project URL** and **anon public key**.

## 6. Test Login

Run `npm run dev`, go to `/admin/login`, and sign in with your admin email and password.

---

## Tables Created

| Table | Purpose |
|---|---|
| `products` | Product catalogue (read-public, write-admin) |
| `orders` | Customer orders (admin only) |
| `order_items` | Line items per order |
| `inventory` | Stock levels per product/size |
| `customers` | Customer records |

All tables use Row Level Security (RLS). Admin access is granted to users with `user_metadata.is_admin = true`.
