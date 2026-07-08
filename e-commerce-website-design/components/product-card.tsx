'use client';

import Link from 'next/link';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/lib/cart-store';
import { useAuthStore } from '@/lib/auth-store';
import { useRouter } from 'next/navigation';
import type { Product } from '@/lib/mock-data';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { user } = useAuthStore();
  const router = useRouter();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (user?.role !== 'user') {
      router.push('/login');
      return;
    }
    addItem(product, 1);
  };

  return (
    <Link href={`/product/${product.id}`}>
      <div
        className="group rounded-lg overflow-hidden border border-border bg-card hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden bg-secondary h-64">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
              -{discount}%
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsWishlisted(!isWishlisted);
            }}
            className="absolute top-3 left-3 h-10 w-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all duration-200"
          >
            <Heart
              size={20}
              className={isWishlisted ? 'fill-primary text-primary' : 'text-foreground'}
            />
          </button>

          {/* Quick Add to Cart - Visible on Hover */}
          {isHovering && user?.role === 'user' && (
            <button
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
              className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground py-3 flex items-center justify-center gap-2 font-semibold hover:opacity-90 transition"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              {product.category}
            </p>
            <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 my-3">
            <div className="flex text-accent">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.floor(product.rating) ? 'fill-current' : ''}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviews})
            </span>
          </div>

          {/* Price and Stock */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-lg font-bold text-foreground">
                PKR {product.price.toLocaleString()}
              </p>
              {product.originalPrice && (
                <p className="text-sm text-muted-foreground line-through">
                  PKR {product.originalPrice.toLocaleString()}
                </p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {product.stock > 0 ? (
                <span className="text-green-600 font-semibold">In Stock</span>
              ) : (
                <span className="text-red-600 font-semibold">Out of Stock</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
