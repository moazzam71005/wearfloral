"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/types";

interface ProductRowProps {
  title: string;
  label?: string;
  products: Product[];
  viewAllHref?: string;
}

export function ProductRow({ title, label, products, viewAllHref }: ProductRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -280 : 280,
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  return (
    <section className="py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            {label && (
              <p className="text-xs font-semibold uppercase tracking-widest text-rose-500">
                {label}
              </p>
            )}
            <h2 className="mt-1 font-heading text-3xl font-bold text-stone-900 sm:text-4xl">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {viewAllHref && (
              <Link
                href={viewAllHref}
                className="mr-2 hidden text-sm font-medium text-stone-500 hover:text-rose-500 sm:block"
              >
                View All →
              </Link>
            )}
            <button
              onClick={() => scroll("left")}
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-stone-200 text-stone-500 transition hover:border-rose-400 hover:text-rose-500 sm:flex"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-stone-200 text-stone-500 transition hover:border-rose-400 hover:text-rose-500 sm:flex"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        >
          {products.map((product) => (
            <div key={product.id} className="w-[200px] shrink-0 snap-start sm:w-[240px]">
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
  label,
  products,
  viewAllHref,
}: {
  title: string;
  label?: string;
  products: Product[];
  viewAllHref?: string;
}) {
  return (
    <section className="py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            {label && (
              <p className="text-xs font-semibold uppercase tracking-widest text-rose-500">
                {label}
              </p>
            )}
            <h2 className="mt-1 font-heading text-3xl font-bold text-stone-900 sm:text-4xl">
              {title}
            </h2>
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-sm font-medium text-stone-500 hover:text-rose-500"
            >
              View All →
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 4} />
          ))}
        </div>
      </div>
    </section>
  );
}
