import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
      )
    : 0;

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-stone-100">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNewArrival && (
            <Badge className="bg-rose-400 text-white hover:bg-rose-400">
              New
            </Badge>
          )}
          {discount > 0 && (
            <Badge variant="secondary" className="bg-white/90 text-stone-900">
              -{discount}%
            </Badge>
          )}
        </div>
        {product.stock <= product.lowStockThreshold && (
          <Badge
            variant="destructive"
            className="absolute right-3 top-3"
          >
            Low Stock
          </Badge>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-xs uppercase tracking-wider text-stone-500">
          {product.brand}
        </p>
        <h3 className="line-clamp-2 font-medium text-stone-900 group-hover:text-rose-500 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 text-xs text-stone-500">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span>{product.rating}</span>
          <span>({product.reviewCount})</span>
        </div>
        <div className="flex items-center gap-2">
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
