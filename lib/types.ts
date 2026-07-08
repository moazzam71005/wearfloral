export type Category =
  | "Lawn"
  | "Kurtis"
  | "Shalwar Kameez"
  | "Dupattas"
  | "Accessories";

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  material: string;
  care: string;
  shipping: string;
  category: Category;
  brand: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  colors: string[];
  sizes: string[];
  stock: number;
  lowStockThreshold: number;
  sku: string;
  isNewArrival: boolean;
  isBestSeller: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  size: string;
  stock: number;
  lowStockThreshold: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface CategoryRevenue {
  category: Category;
  revenue: number;
}

export interface DashboardStats {
  totalRevenue: number;
  ordersToday: number;
  lowStockItems: number;
  totalCustomers: number;
}

export type SortOption = "newest" | "price-asc" | "price-desc" | "popular";

export interface ProductFilters {
  search: string;
  categories: Category[];
  brands: string[];
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  sort: SortOption;
}
