# Wear Floral - Desi Women's Clothing Ecommerce

A modern, fully-responsive ecommerce platform for branded desi women's clothing, built with Next.js 16, React 19, and TypeScript. Features include user authentication, product browsing with advanced filtering, shopping cart, and a comprehensive admin dashboard.

## Features

### User-Facing Features
- **Modern Landing Page** with hero section, category showcase, and featured products
- **Product Browsing** with search, filtering by category and price range
- **Product Details** with image gallery, ratings, quantity selection, and add-to-cart
- **Shopping Cart** with real-time totals, quantity management, and checkout simulation
- **User Authentication** with email/password login and signup
- **Order Tracking** - View order history and status
- **Responsive Design** - Fully mobile-friendly interface
- **White Theme** - Clean, elegant aesthetic with warm accent colors

### Admin Dashboard Features
- **Dashboard Overview** with key metrics (revenue, orders, products, customers)
- **Product Management** - View all products, stock levels, and pricing
- **Order Management** - Track all orders with status and revenue details
- **Inventory Management** - Monitor low-stock items and manage stock levels
- **Sales Analytics** - View revenue metrics and order trends

### Technical Features
- **Client-side State Management** using Zustand for cart and auth
- **Mock Data** with realistic product catalog and order history
- **Form Validation** using React Hook Form and Zod
- **Protected Routes** - Different access levels for users, admins, and guests
- **Persistent State** using localStorage for cart and auth
- **Responsive Grid Layouts** using Tailwind CSS
- **Modern UI Components** with shadcn/ui library

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **React**: 19 (Latest)
- **Styling**: Tailwind CSS v4 with custom theme
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **UI Components**: shadcn/ui

## Project Structure

```
app/
├── page.tsx                 # Home page
├── shop/
│   └── page.tsx            # Shop with filtering
├── product/
│   └── [id]/page.tsx       # Product detail
├── cart/
│   └── page.tsx            # Shopping cart
├── orders/
│   └── page.tsx            # Order history
├── login/
│   └── page.tsx            # Login page
├── signup/
│   └── page.tsx            # Signup page
├── checkout-success/
│   └── page.tsx            # Order confirmation
├── admin/
│   └── page.tsx            # Admin dashboard
└── layout.tsx              # Root layout

components/
├── header.tsx              # Navigation & auth
├── hero.tsx                # Hero section
├── categories.tsx          # Category showcase
├── product-card.tsx        # Product card component
├── footer.tsx              # Footer with links

lib/
├── auth-store.ts           # Zustand auth store
├── cart-store.ts           # Zustand cart store
├── mock-data.ts            # Mock products & orders
└── utils.ts                # Utility functions
```

## Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

The app will be available at `http://localhost:3000`

## Demo Accounts

### Customer Account
- Email: `customer@example.com`
- Password: `demo123`
- Access: Shop, cart, orders, wishlist

### Admin Account
- Email: `admin@example.com`
- Password: `demo123`
- Access: Full admin dashboard with all features

## Key Pages

### Public Pages
- `/` - Home page with hero and featured products
- `/shop` - Product listing with filters
- `/product/[id]` - Product detail page
- `/login` - Login page (has demo buttons)
- `/signup` - Signup page

### Protected Pages (Requires Login as Customer)
- `/cart` - Shopping cart
- `/orders` - Order history and tracking

### Admin Pages (Requires Admin Login)
- `/admin` - Admin dashboard with tabs for overview, products, orders, inventory

## Color Theme

The site uses a warm, elegant color palette:
- **Primary**: `#c97c5c` (Warm rust/terracotta)
- **Accent**: `#d4a574` (Warm gold)
- **Background**: White (`#ffffff`)
- **Foreground**: Dark (`#0f0f0f`)
- **Secondary**: Cream (`#f5f0ed`)
- **Border**: Light gray (`#e5e5e5`)

## Mock Data

The application comes with:
- **6 Products** - Sample desi clothing items (Kurtis, Sarees, Lehengas, Suits)
- **2 Orders** - Sample orders for testing order tracking
- **1 Sample User** - Pre-populated user with order history

All data is stored in `lib/mock-data.ts` and can be easily replaced with API calls.

## State Management

### Authentication Store (Zustand)
- User login/signup
- Role-based access (user/admin)
- Persistent auth state

### Cart Store (Zustand)
- Add/remove items
- Update quantities
- Calculate totals
- Persistent cart storage

## Mock Checkout Flow

The checkout is simulated:
1. Add items to cart
2. View cart with pricing details
3. Click "Proceed to Checkout"
4. See order confirmation page
5. Cart is cleared after checkout

## Next Steps for Backend Integration

When building the backend:

1. **Replace Mock Data**
   - Create API endpoints for products
   - Fetch products from database

2. **Implement Real Auth**
   - Create auth endpoints (login, signup)
   - Set up JWT tokens
   - Replace Zustand with server-side sessions

3. **Add Order Management**
   - Create checkout endpoint
   - Process payments (EasyPaisa/JazzCash)
   - Save orders to database

4. **Inventory Management**
   - Track stock in database
   - Update stock on purchase
   - Add product management APIs

## Environment Variables

Current setup uses mock data, so no environment variables are required. When integrating with backend:

```
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_PAYMENT_KEY=easypaisa_or_jazzcash_key
```

## Responsive Design

- **Mobile**: < 640px - Single column layout
- **Tablet**: 640px - 1024px - Two column layout
- **Desktop**: > 1024px - Three column layout with sidebar

All components are fully responsive and tested on various screen sizes.

## Performance Optimizations

- Next.js Image Optimization (ready for real images)
- Static rendering where possible
- Client-side state management to reduce server calls
- Lazy loading of components

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For issues or questions about the frontend implementation, please refer to the component documentation and mock data structure in the respective files.

---

**Built with ❤️ for Wear Floral** - Premium Branded Desi Women's Clothing
