export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface Product {
  id: string;
  productCode: string;
  name: string;
  brand: string;
  volume: string;
  description: string;
  imagePath: string;
  imageUrl: string;
  displayPrice: number;
  discountPrice: number;
  purchasePrice: number;
  isSold: boolean;
  createdAt: string;
}

export interface Profile {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  email?: string;
  createdAt?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  imageUrl: string;
  discountPrice: number;
  displayPrice: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  imageUrl: string;
  brand: string;
  volume: string;
  displayPrice: number;
  discountPrice: number;
  purchasePrice: number;
}

export interface Order {
  id: string;
  customerId: string;
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

export interface CustomerWithStats extends Profile {
  orderCount: number;
  totalSpent: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  profit: number;
  orders: number;
}

export interface BrandRevenue {
  brand: string;
  revenue: number;
  profit: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalProfit: number;
  ordersToday: number;
  totalCustomers: number;
  availablePieces: number;
}

export type SortOption = "newest" | "price-asc" | "price-desc";

export interface ProductFilters {
  search: string;
  brands: string[];
  priceRange: [number, number];
  sort: SortOption;
}

export type ProductInput = Omit<Product, "id" | "imageUrl" | "isSold" | "createdAt">;

export function calcDiscountPercent(displayPrice: number, discountPrice: number): number {
  if (displayPrice <= 0 || discountPrice >= displayPrice) return 0;
  return Math.round(((displayPrice - discountPrice) / displayPrice) * 100);
}

export function calcProfit(discountPrice: number, purchasePrice: number): number {
  return discountPrice - purchasePrice;
}
