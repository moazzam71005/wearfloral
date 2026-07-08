export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  stock: number;
  description: string;
  rating: number;
  reviews: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  deliveryDate?: string;
  address: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  orders: Order[];
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Emerald Dream Kurti',
    category: 'Kurtis',
    price: 1299,
    originalPrice: 1899,
    image: 'https://images.unsplash.com/photo-1610204388537-b7fbfb7fb523?w=500&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1610204388537-b7fbfb7fb523?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=600&fit=crop',
    ],
    stock: 25,
    description: 'Beautiful emerald colored kurti with intricate embroidery. Perfect for casual and semi-formal occasions.',
    rating: 4.8,
    reviews: 156,
  },
  {
    id: '2',
    name: 'Golden Elegance Saree',
    category: 'Sarees',
    price: 2499,
    originalPrice: 3999,
    image: 'https://images.unsplash.com/photo-1629372159122-3e5f4fe0f85d?w=500&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1629372159122-3e5f4fe0f85d?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1612144875935-53ac681d797d?w=500&h=600&fit=crop',
    ],
    stock: 18,
    description: 'Elegant golden saree with silk blend fabric. Features beautiful zari work perfect for weddings and celebrations.',
    rating: 4.9,
    reviews: 98,
  },
  {
    id: '3',
    name: 'Rose Pink Lehenga',
    category: 'Lehengas',
    price: 3999,
    originalPrice: 5999,
    image: 'https://images.unsplash.com/photo-1599599810763-e96532a51eca?w=500&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1599599810763-e96532a51eca?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1612144875935-53ac681d797d?w=500&h=600&fit=crop',
    ],
    stock: 12,
    description: 'Stunning rose pink lehenga with intricate embellishments. Ideal for weddings and festive occasions.',
    rating: 5.0,
    reviews: 127,
  },
  {
    id: '4',
    name: 'Navy Blue Palazzo Suit',
    category: 'Suits',
    price: 1599,
    originalPrice: 2299,
    image: 'https://images.unsplash.com/photo-1515602885666-1c0d319dcbf5?w=500&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1515602885666-1c0d319dcbf5?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=600&fit=crop',
    ],
    stock: 30,
    description: 'Comfortable navy blue palazzo suit with matching dupatta. Great for daily wear and office occasions.',
    rating: 4.7,
    reviews: 89,
  },
  {
    id: '5',
    name: 'Maroon Anarkali Dress',
    category: 'Kurtis',
    price: 1799,
    originalPrice: 2699,
    image: 'https://images.unsplash.com/photo-1595642632823-38afd9a27ee0?w=500&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1595642632823-38afd9a27ee0?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1599599810763-e96532a51eca?w=500&h=600&fit=crop',
    ],
    stock: 22,
    description: 'Elegant maroon Anarkali dress with beautiful detailing. Perfect for festive and semi-formal events.',
    rating: 4.6,
    reviews: 112,
  },
  {
    id: '6',
    name: 'Cream Cotton Kurta',
    category: 'Kurtis',
    price: 799,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1585487034210-c4282e4ef814?w=500&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1585487034210-c4282e4ef814?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1610204388537-b7fbfb7fb523?w=500&h=600&fit=crop',
    ],
    stock: 45,
    description: 'Simple yet elegant cream cotton kurta. Versatile and comfortable for everyday wear.',
    rating: 4.5,
    reviews: 234,
  },
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    userId: 'user1',
    items: [
      {
        ...mockProducts[0],
        quantity: 1,
      },
    ],
    total: 1299,
    status: 'delivered',
    date: '2025-12-15',
    deliveryDate: '2025-12-22',
    address: '123 Main Street, Karachi',
  },
  {
    id: 'ORD-002',
    userId: 'user1',
    items: [
      {
        ...mockProducts[1],
        quantity: 1,
      },
      {
        ...mockProducts[5],
        quantity: 2,
      },
    ],
    total: 4297,
    status: 'shipped',
    date: '2026-01-08',
    deliveryDate: '2026-01-15',
    address: '123 Main Street, Karachi',
  },
];

export const mockUser: User = {
  id: 'user1',
  email: 'customer@example.com',
  name: 'Sarah Ahmed',
  phone: '+92 300 1234567',
  address: '123 Main Street, Karachi',
  orders: mockOrders,
};
