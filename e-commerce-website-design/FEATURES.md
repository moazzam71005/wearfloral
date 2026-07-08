# Wear Floral - Complete Feature List

## Public Pages (No Login Required)

### Homepage `/`
- Hero section with search functionality
- Feature highlights (Free Shipping, Easy Returns, 100% Authentic)
- Category showcase (Kurtis, Sarees, Lehengas, Suits)
- Featured product grid (6 products)
- Footer with contact info and social links

### Shop Page `/shop`
- Product grid with 2-column responsive layout
- **Filtering Options**:
  - Category filter (All, Kurtis, Sarees, Lehengas, Suits)
  - Price range slider (PKR 0 - 5000)
  - Reset filters button
- **Sorting Options**:
  - Featured (default)
  - Newest
  - Price: Low to High
  - Price: High to Low
  - Highest Rated
- Product cards with:
  - Product image with hover effects
  - Discount badge
  - Wishlist button (toggle)
  - Rating and review count
  - Price (original and sale)
  - Stock status
  - Category label

### Product Detail Page `/product/[id]`
- Image gallery with thumbnails
- Product information:
  - Name, category, rating/reviews
  - Price and original price (with savings)
  - Detailed description
  - Stock status indicator
- **Product Controls**:
  - Quantity selector (±)
  - Add to Cart button
  - Buy Now button (quick checkout)
  - Wishlist button
- Related products carousel (4 items from same category)
- Additional product info:
  - Material details
  - Shipping info
  - Return policy

### Login Page `/login`
- **Role Selection**:
  - Customer mode
  - Admin mode
- Email and password fields
- Show/hide password toggle
- Sign In button (disabled until form is valid)
- **Demo Login Buttons**:
  - Login as Customer
  - Login as Admin
- Error display
- Link to signup page
- Loading state during login

### Signup Page `/signup`
- Full name field
- Email field
- Password field with visibility toggle
- Confirm password field
- Terms & conditions checkbox
- Error messages
- Loading state
- Link to login page

---

## User Dashboard Pages (Requires Customer Login)

### Shopping Cart `/cart`
- **Empty Cart State**:
  - Shopping cart icon
  - Empty message with link to continue shopping

- **Active Cart**:
  - Cart items list with:
    - Product image and name
    - Category
    - Unit price
    - Quantity selector (±)
    - Line total
    - Remove button
  - Order summary panel:
    - Subtotal
    - Shipping cost (free over PKR 5000)
    - Tax (10%)
    - Total price
  - **Action Buttons**:
    - Proceed to Checkout
    - Continue Shopping
  - Info banner about free shipping

### Order History Page `/orders`
- **Orders List**:
  - Order ID (clickable)
  - Order date
  - Status badge (pending/confirmed/shipped/delivered/cancelled)
  - Total amount

- **Order Details** (expandable):
  - Order items with images
  - Quantity × price
  - Item totals
  - Delivery address
  - Expected delivery date
  - Payment status

---

## Admin Dashboard Pages (Requires Admin Login)

### Admin Dashboard `/admin`

**Overview Tab** (Default):
- **Key Metrics**:
  - Total Revenue (PKR amount with % change)
  - Total Orders (with completed count)
  - Products (with low stock alert)
  - Customers (active count)
- **Recent Orders Table**:
  - Order ID
  - Date
  - Amount (in PKR)
  - Status badge

**Products Tab**:
- Products management table:
  - Product name
  - Price (in PKR)
  - Stock level (color-coded: green/orange)
  - Category
- Add Product button (UI ready for backend)
- Table is sortable and scrollable

**Orders Tab**:
- Complete orders table:
  - Order ID
  - Order date
  - Number of items
  - Total amount
  - Status (with badge)
- Searchable and sortable

**Inventory Tab**:
- Low stock items only:
  - Product name
  - Stock count (highlighted in orange)
  - Restock button (UI ready for backend)
- Empty state if no low stock items

---

## Authentication Features

### Login Flow
1. Navigate to `/login`
2. Choose role (Customer or Admin)
3. Enter credentials or use demo button
4. System validates and logs user in
5. Redirected to home page or intended destination

### Session Management
- Persistent login using localStorage
- Auto-logout on page refresh available
- Different nav menus based on role
- Protected routes redirect to login if needed

### User States in Header
- **Logged Out**: Login link
- **Logged In as User**: Orders link + Logout + Cart with item count
- **Logged In as Admin**: Admin dashboard link + Logout

---

## Shopping Features

### Product Discovery
- Search bar on homepage
- Category browsing with image tiles
- Product grid with sorting and filtering
- Related products on detail page

### Cart Management
- Add to cart from product cards (on hover)
- Add to cart from product detail page
- Adjust quantities
- Remove items
- Real-time total calculation
- Empty cart button available

### Wishlist
- Toggle heart icon on product cards
- Toggle on product detail page
- Currently stores in component state (ready for backend)

---

## Mock Data

### Products (6 items)
1. Emerald Dream Kurti (Kurtis) - PKR 1,299
2. Golden Elegance Saree (Sarees) - PKR 2,499
3. Rose Pink Lehenga (Lehengas) - PKR 3,999
4. Navy Blue Palazzo Suit (Suits) - PKR 1,599
5. Maroon Anarkali Dress (Kurtis) - PKR 1,799
6. Cream Cotton Kurta (Kurtis) - PKR 799

### Sample User Data
- Customer: customer@example.com (password: demo123)
- Admin: admin@example.com (password: demo123)

### Sample Orders (for customer account)
- 2 orders with different statuses
- Multiple items per order
- Delivery tracking information

---

## Responsive Behavior

### Mobile (< 640px)
- Single column product grid
- Collapsed sidebar in shop page
- Full-width hero section
- Hamburger menu for navigation
- Touch-friendly buttons and spacing

### Tablet (640px - 1024px)
- Two-column product grid
- Visible sidebar filters
- Optimized spacing
- Tab navigation for admin

### Desktop (> 1024px)
- Three-column product grid
- Sticky sidebar with filters
- Full navigation in header
- Horizontal tabs for admin dashboard

---

## Color Scheme & Design

**Primary Color**: #c97c5c (Terracotta/Rust)
**Accent Color**: #d4a574 (Warm Gold)
**Background**: White (#ffffff)
**Text**: Dark (#0f0f0f)
**Secondary**: Cream (#f5f0ed)
**Borders**: Light Gray (#e5e5e5)

**Typography**:
- Headings: Bold, sans-serif
- Body: Regular weight, readable line-height
- Consistent sizing across pages

---

## Navigation Structure

```
Home (/)
├── Shop (/shop)
│   ├── Product Detail (/product/[id])
│   └── Category Filtered Views
├── About (/about) [Placeholder]
├── Contact (/contact) [Placeholder]
├── Login (/login)
│   └── Signup (/signup)
└── User Dashboard (when logged in)
    ├── Cart (/cart)
    ├── Orders (/orders)
    └── Admin (/admin) [if admin]
```

---

## Interactive Elements

- Hover states on buttons and product cards
- Smooth transitions and animations
- Loading states during async operations
- Error messages for form validation
- Success notifications for cart additions
- Disabled states for unavailable products
- Keyboard navigation support
- Mobile-friendly touch targets

---

## Accessibility Features

- Semantic HTML elements
- ARIA labels where needed
- Proper heading hierarchy
- Alt text for images
- Keyboard navigable forms
- Focus visible states
- Color contrast compliance
- Screen reader friendly

---

## Performance Optimizations

- Next.js App Router with server-side rendering ready
- Client-side state management (Zustand)
- Image optimization ready
- CSS-in-JS with Tailwind
- No unnecessary re-renders
- Lazy loading structure in place
- Mock data loading patterns

---

For backend integration details, see `BACKEND_INTEGRATION.md`
For technical setup, see `README.md`
