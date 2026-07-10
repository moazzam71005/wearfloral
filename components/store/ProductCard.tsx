"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { calcDiscountPercent, getStorefrontPrice } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority }: ProductCardProps) {
  const { addItem, hasItem } = useCart();
  const discount = calcDiscountPercent(product.displayPrice, product.discountPrice);
  const inCart = hasItem(product.id);
  const soldOut = product.isSold;
  const storefrontPrice = getStorefrontPrice(product);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inCart || soldOut) return;
    addItem({
      productId: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      discountPrice: product.discountPrice,
      displayPrice: product.displayPrice,
    });
  };

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className={`relative aspect-[3/4] overflow-hidden rounded-2xl bg-stone-100 ${soldOut ? "opacity-90" : ""}`}>
        <Image
          src={product.imageUrl || "/placeholder-product.svg"}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-500 ${soldOut ? "" : "group-hover:scale-105"}`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
        />

        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/35">
            <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-stone-900 sm:text-sm">
              Sold Out
            </span>
          </div>
        )}

        {discount > 0 && !soldOut && (
          <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-2.5 py-0.5 text-[11px] font-semibold text-white">
            -{discount}%
          </span>
        )}

        <div className={`absolute inset-x-0 bottom-0 transition-transform duration-300 ${soldOut ? "hidden" : "translate-y-full group-hover:translate-y-0"}`}>
          <button
            onClick={handleQuickAdd}
            disabled={inCart || soldOut}
            className="flex w-full items-center justify-center gap-2 bg-stone-900/90 py-3.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-rose-600 transition-colors disabled:bg-stone-600"
          >
            <ShoppingBag className="h-4 w-4" />
            {inCart ? "In Cart" : "Add to Cart"}
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-1 px-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
          {product.brand}
        </p>
        <h3 className="line-clamp-2 text-sm font-medium text-stone-900 group-hover:text-rose-500 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-stone-500">{product.volume}</p>
        <div className="flex items-center gap-2 pt-0.5">
          <span className="font-semibold text-stone-900">
            {formatCurrency(storefrontPrice)}
          </span>
          {!soldOut && discount > 0 && (
            <span className="text-sm text-stone-400 line-through">
              {formatCurrency(product.displayPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
