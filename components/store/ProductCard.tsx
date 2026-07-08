"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority }: ProductCardProps) {
  const { addItem } = useCart();
  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
      )
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      size: product.sizes[0],
      color: product.colors[0],
      quantity: 1,
    });
  };

  return (
    <Link href={`/product/${product.id}`} className="group block">
      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-stone-100">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
        />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNewArrival && (
            <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-[11px] font-semibold text-white">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[11px] font-semibold text-white">
              -{discount}%
            </span>
          )}
          {product.stock <= product.lowStockThreshold && product.stock > 0 && (
            <span className="rounded-full bg-red-500 px-2.5 py-0.5 text-[11px] font-semibold text-white">
              Low Stock
            </span>
          )}
        </div>

        {/* Quick add overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
          <button
            onClick={handleQuickAdd}
            className="flex w-full items-center justify-center gap-2 bg-stone-900/90 py-3.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-rose-600 transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            Quick Add
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1 px-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
          {product.brand}
        </p>
        <h3 className="line-clamp-2 text-sm font-medium text-stone-900 group-hover:text-rose-500 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="text-xs text-stone-500">{product.rating}</span>
          <span className="text-xs text-stone-400">({product.reviewCount})</span>
        </div>
        <div className="flex items-center gap-2 pt-0.5">
          <span className="font-semibold text-stone-900">
            {formatCurrency(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-stone-400 line-through">
              {formatCurrency(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
