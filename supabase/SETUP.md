# Supabase Setup — Wear Floral

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Choose a name, set a database password, pick a region close to Pakistan

## 2. Run Migrations (in order)

1. **SQL Editor** → New query → paste `supabase/migrations/001_schema.sql` → Run
2. **SQL Editor** → New query → paste `supabase/migrations/002_revamp.sql` → Run
3. **SQL Editor** → New query → paste `supabase/migrations/003_multi_images.sql` → Run
4. **SQL Editor** → New query → paste `supabase/migrations/004_guest_checkout.sql` → Run
5. **SQL Editor** → New query → paste `supabase/migrations/005_reviews.sql` → Run

> Migration 002 drops and recreates tables with the new unstitched-fabric schema.
> Migration 003 adds multiple product images + thumbnail selection support.
> Migration 004 enables guest WhatsApp checkout (no account / email verification required).
> Migration 005 adds customer reviews (admin-entered) shown on the homepage.

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
- Customer: add to cart → `/checkout` (guest details form) → WhatsApp. Account signup is optional.

## 7. Custom SMTP + branded confirmation email

Supabase’s built-in mailer **does not let you edit HTML templates** until custom SMTP is enabled.
You also need this for production (the free mailer is limited to a couple of emails per hour).

### A. Easiest free option: Resend

1. Create an account at [resend.com](https://resend.com)
2. **Domains** → add a domain you own (e.g. `wearfloral.com`) → add the DNS records they show → wait until verified  
   - If you don’t have a domain yet, Resend lets you send from their test domain for trying, but deliverability is better with your own domain.
3. **API Keys** → Create API Key → copy it

### B. Paste SMTP into Supabase

Go to: **Authentication → Emails → SMTP Settings**  
(or `https://supabase.com/dashboard/project/_/auth/smtp`)

| Field | Value |
|--------|--------|
| Enable Custom SMTP | On |
| Sender email | e.g. `noreply@yourdomain.com` (must match Resend) |
| Sender name | `Wear Floral` |
| Host | `smtp.resend.com` |
| Port | `465` (or `587`) |
| Username | `resend` |
| Password | your Resend API key |

Save.

### C. Edit the Confirm signup template

After SMTP is saved, open **Authentication → Email Templates → Confirm signup**:

1. **Subject:** `Confirm your Wear Floral account`
2. Paste the HTML from `supabase/email-templates/confirm-signup.html`
3. Keep `{{ .ConfirmationURL }}` unchanged
4. Save

### D. URL config

**Authentication → URL Configuration**

- Site URL = your live site (or `http://localhost:3000` locally)
- Redirect URLs include localhost + your Vercel URL with `/**`

### Without buying a domain (your case)

You **cannot** freely pick any sender address (e.g. `orders@wearfloral.com`) without owning that domain — providers block it, and spam filters treat it as spoofing.

**Free option that works:** Gmail SMTP with your real Gmail:

| Field | Value |
|--------|--------|
| Sender email | `saleswearfloral@gmail.com` |
| Sender name | `Wear Floral` |
| Host | `smtp.gmail.com` |
| Port | `465` |
| Username | `saleswearfloral@gmail.com` |
| Password | Gmail **App Password** |

You can still customize the HTML template after SMTP is connected. The “From” name will show as **Wear Floral**, address as `saleswearfloral@gmail.com`.

**About spam:** without your own domain, some inbox providers will still filter auth emails. Reduce spam risk by:
1. Asking customers to check Spam / Promotions once and mark **Not spam**
2. Keeping subject/body simple (our template is already mild)
3. Sending from Gmail SMTP (above), not a random “any email”

Resend/Brevo free tiers without a domain only allow their shared test senders (often worse spam). Gmail is the best free path for you right now.

## Tables

| Table | Purpose |
|---|---|
| `products` | Unstitched fabric pieces (unique, one-of-a-kind) |
| `profiles` | Customer name, phone, address, city |
| `orders` | Customer orders with status tracking |
| `order_items` | Line items per order (with purchase price for profit) |
| `product-images` (storage) | Product photos uploaded by admin |
