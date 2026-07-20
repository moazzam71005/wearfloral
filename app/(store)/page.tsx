"use client";

import { Loader2 } from "lucide-react";
import { useData } from "@/context/DataContext";
import { Hero } from "@/components/store/Hero";
import { PaymentInfo } from "@/components/store/PaymentInfo";
import { ReviewsCarousel } from "@/components/store/ReviewsCarousel";
import { BrandCards } from "@/components/store/BrandCards";
import { ProductRow } from "@/components/store/ProductRow";
import { Newsletter } from "@/components/store/Newsletter";
import { BRANDS } from "@/lib/constants";

export default function HomePage() {
  const { products, reviews, isLoading } = useData();

  const brandsWithProducts = BRANDS.filter((brand) =>
    products.some((p) => p.brand === brand)
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-400" />
      </div>
    );
  }

  return (
    <>
      <Hero />
      <PaymentInfo />
      <ReviewsCarousel reviews={reviews} />
      <BrandCards products={products} />
      {brandsWithProducts.map((brand) => {
        const brandProducts = products.filter((p) => p.brand === brand);
        if (brandProducts.length === 0) return null;
        return (
          <ProductRow
            key={brand}
            title={brand}
            label="Brand Collection"
            products={brandProducts}
            viewAllHref={`/shop?brand=${encodeURIComponent(brand)}`}
          />
        );
      })}
      {products.length === 0 && (
        <div className="py-20 text-center text-stone-500">
          <p className="text-lg">New fabrics coming soon!</p>
          <p className="mt-2 text-sm">Check back for our latest unstitched collections.</p>
        </div>
      )}
      <Newsletter />
    </>
  );
}
