# Wear Floral

Elegant desi women's clothing e-commerce storefront with a full admin dashboard.

## Features

### Customer Storefront
- Landing page with hero, categories, new arrivals, best sellers, newsletter
- Shop with filters (category, price, size, color, brand) and sorting
- Product detail pages with image gallery, size/color picker, add to cart
- Cart drawer and dedicated cart/checkout pages
- Fully responsive mobile-first design with white/rose theme

### Admin Dashboard (`/admin`)
- Password-protected owner panel (demo password: `wearfloral2024`)
- Overview: revenue stats, recent orders, sparkline chart
- Products: add, edit, delete inventory
- Orders: filter by status, view details, update status
- Inventory: stock levels with low-stock alerts
- Revenue: charts by day/week/month and by category

## Tech Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** + **shadcn/ui**
- **Lucide React** icons
- **Recharts** for admin analytics
- **Mock data** in `lib/mock-data.ts` (ready for Supabase swap)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the store.
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the dashboard.

## Deploy to Vercel

1. Push this repo to [GitHub](https://github.com/moazzam71005/wearfloral)
2. Import the repo on [Vercel](https://vercel.com)
3. Deploy (no env vars needed for mock data)

## Future: Supabase Integration

Replace data calls in `lib/mock-data.ts` with Supabase client queries. Suggested tables:
- `products`, `orders`, `order_items`, `inventory`, `users`

Supabase free tier works well for this project alongside Vercel's free hosting.
