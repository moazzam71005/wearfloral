import Link from "next/link";
import { BRANDS } from "@/lib/constants";
import type { Product } from "@/lib/types";

interface BrandCardsProps {
  products: Product[];
}

export function BrandCards({ products }: BrandCardsProps) {
  const brandsWithProducts = BRANDS.filter((brand) =>
    products.some((p) => p.brand === brand)
  );

  if (brandsWithProducts.length === 0) return null;

  return (
    <section id="brands" className="py-14 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-rose-500">
            Shop by Brand
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-stone-900 sm:text-4xl">
            Renowned Brands
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {brandsWithProducts.map((brand) => {
            const count = products.filter((p) => p.brand === brand).length;
            return (
              <Link
                key={brand}
                href={`/shop?brand=${encodeURIComponent(brand)}`}
                className="group flex flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white p-6 text-center transition hover:border-rose-300 hover:shadow-md"
              >
                <span className="text-lg font-bold text-stone-900 group-hover:text-rose-500 transition-colors">
                  {brand}
                </span>
                <span className="mt-1 text-xs text-stone-500">
                  {count} piece{count !== 1 ? "s" : ""}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
