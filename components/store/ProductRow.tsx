"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface ProductRowProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
}

export function ProductRow({
  title,
  subtitle,
  products,
  viewAllHref,
}: ProductRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  if (products.length === 0) return null;

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">{title}</h2>
            {subtitle && (
              <p className="mt-1 text-stone-500">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {viewAllHref && (
              <Link
                href={viewAllHref}
                className="mr-2 hidden text-sm font-medium text-rose-500 hover:text-rose-600 sm:block"
              >
                View All
              </Link>
            )}
            <Button
              variant="outline"
              size="icon"
              className="hidden sm:flex h-8 w-8"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden sm:flex h-8 w-8"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="mt-6 flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[220px] shrink-0 snap-start sm:w-[260px]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductGrid({
  title,
  products,
}: {
  title: string;
  products: Product[];
}) {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-stone-900">{title}</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
