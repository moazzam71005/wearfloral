# Backend Integration Guide

This document outlines how to integrate the Wear Floral frontend with your backend API.

## Current Architecture

The frontend uses **Zustand** for state management with mock data. All data is currently client-side and persisted to localStorage.

## Integration Points

### 1. Authentication

**Current Implementation**: Mock auth in `lib/auth-store.ts`

**Integration Steps**:

Replace the auth store login/signup methods:

```typescript
// Before: Mock login
login: async (email: string, password: string) => {
  // Simulates login
  // After: Real backend call
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  // Store JWT token, user info, etc.
}
```

**Required Endpoints**:
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

**Expected Response Format**:
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "User Name",
    "role": "user|admin"
  },
  "token": "jwt_token_here"
}
```

### 2. Products

**Current Implementation**: Mock products in `lib/mock-data.ts`

**Integration Steps**:

Create a `lib/api.ts` file with API calls:

```typescript
export async function fetchProducts(filters?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}) {
  const params = new URLSearchParams(filters);
  const response = await fetch(`/api/products?${params}`);
  return response.json();
}

export async function fetchProductById(id: string) {
  const response = await fetch(`/api/products/${id}`);
  return response.json();
}
```

**Required Endpoints**:
- `GET /api/products` - List all products (with filtering)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

**Expected Response Format**:
```json
{
  "id": "1",
  "name": "Emerald Dream Kurti",
  "category": "Kurtis",
  "price": 1299,
  "originalPrice": 1899,
  "image": "url",
  "images": ["url1", "url2"],
  "stock": 25,
  "description": "...",
  "rating": 4.8,
  "reviews": 156
}
```

### 3. Cart & Orders

**Current Implementation**: Mock cart with Zustand in `lib/cart-store.ts`

**Integration Steps**:

Create checkout and order endpoints:

```typescript
export async function createOrder(items: CartItem[], address: string) {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      items,
      address,
      total: calculateTotal(items)
    })
  });
  return response.json();
}
```

**Required Endpoints**:
- `POST /api/orders` - Create new order
- `GET /api/orders` - List user's orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status (admin)
- `DELETE /api/orders/:id` - Cancel order

**Expected Response Format**:
```json
{
  "id": "ORD-001",
  "userId": "user_123",
  "items": [{ product details and quantity }],
  "total": 3000,
  "status": "pending|confirmed|shipped|delivered|cancelled",
  "date": "2026-01-08",
  "deliveryDate": "2026-01-15",
  "address": "delivery address"
}
```

### 4. Admin Dashboard

**Current Implementation**: Mock admin data from orders and products

**Required Admin Endpoints**:
- `GET /api/admin/stats` - Get dashboard metrics
- `GET /api/admin/revenue` - Revenue analytics
- `GET /api/admin/products/low-stock` - Low stock alerts
- `PUT /api/products/:id/stock` - Update stock

## Migration Path

### Phase 1: Basic Integration
1. Keep mock data visible
2. Add API calls alongside mock data
3. Switch between mock/API with environment variable

### Phase 2: Full Integration
1. Replace all mock data with API calls
2. Remove mock data from app
3. Test all flows with real backend

### Phase 3: Payment Integration
1. Add payment processor (EasyPaisa/JazzCash)
2. Update checkout flow
3. Handle payment callbacks

## Environment Variables

Add to `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_API_TIMEOUT=30000
```

## API Call Examples

### Products
```typescript
// In components or pages
import { fetchProducts, fetchProductById } from '@/lib/api';

// List products
const products = await fetchProducts({ category: 'Kurtis', maxPrice: 2000 });

// Get single product
const product = await fetchProductById('1');
```

### Orders
```typescript
import { createOrder, fetchUserOrders } from '@/lib/api';

// Create order
const order = await createOrder(cartItems, address);

// Get user's orders
const orders = await fetchUserOrders();
```

### Authentication
```typescript
import { useAuthStore } from '@/lib/auth-store';

const { login, signup, logout } = useAuthStore();

// Login
await login(email, password);

// Signup
await signup(email, password, name);

// Logout
logout();
```

## Error Handling

Update stores to handle API errors:

```typescript
catch (err: any) {
  if (err.response?.status === 401) {
    // Unauthorized - redirect to login
    router.push('/login');
  } else if (err.response?.status === 400) {
    // Bad request
    setError(err.response.data.message);
  } else {
    // Network or server error
    setError('Something went wrong. Please try again.');
  }
}
```

## Authentication Flow

1. User enters email and password
2. POST to `/api/auth/login`
3. Receive JWT token
4. Store token in localStorage/cookie
5. Add token to Authorization header for protected routes
6. On 401, redirect to login and clear token

## Protected Routes

Routes requiring authentication:
- `/cart` - Must be logged in as user
- `/orders` - Must be logged in as user
- `/admin` - Must be logged in as admin

Add middleware or check in pages:
```typescript
if (!user || user.role !== 'user') {
  return redirect('/login');
}
```

## Data Validation

Add Zod schemas to validate API responses:

```typescript
const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(),
  // ... other fields
});

const response = await fetch('/api/products/1');
const data = ProductSchema.parse(await response.json());
```

## Testing Integration

Use the demo accounts to test:

**Customer Flow**:
1. Login with customer account
2. Browse products
3. Add to cart
4. Checkout
5. See order confirmation
6. View orders

**Admin Flow**:
1. Login with admin account
2. View dashboard
3. Check products list
4. Check orders
5. Monitor inventory

## Database Recommendations

For backend implementation:

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  phone VARCHAR,
  address TEXT,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Products Table
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  price DECIMAL NOT NULL,
  original_price DECIMAL,
  stock INT DEFAULT 0,
  description TEXT,
  rating FLOAT,
  reviews INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  total DECIMAL NOT NULL,
  status VARCHAR DEFAULT 'pending',
  delivery_address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Common Issues & Solutions

**CORS Issues**
- Add CORS headers to backend
- Use proxy in development

**Token Expiration**
- Implement refresh token flow
- Auto-refresh before expiration
- Redirect to login on 401

**Race Conditions**
- Add loading states
- Prevent double submissions
- Use optimistic updates

## Performance Tips

- Cache products data with SWR or React Query
- Paginate large lists
- Lazy load product images
- Implement request debouncing for search

## Security Considerations

- Never store passwords on frontend
- Use HTTPS for all API calls
- Validate data on backend
- Implement CSRF protection
- Rate limit login attempts
- Hash passwords on backend
- Use secure cookies for tokens

---

For questions or specific implementation needs, refer to the component source code and mock data structure.
