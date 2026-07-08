"use client";

import { useData } from "@/context/DataContext";
import { Hero } from "@/components/store/Hero";
import { CategoryCards } from "@/components/store/CategoryCards";
import { ProductRow, ProductGrid } from "@/components/store/ProductRow";
import { PromoBanner } from "@/components/store/PromoBanner";
import { Newsletter } from "@/components/store/Newsletter";

export default function HomePage() {
  const { products } = useData();

  const newArrivals = products.filter((p) => p.isNewArrival);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);

  return (
    <>
      <Hero />
      <CategoryCards />
      <ProductRow
        title="New In"
        label="Fresh Arrivals"
        products={newArrivals}
        viewAllHref="/shop?filter=new"
      />
      <PromoBanner />
      <ProductGrid
        title="Best Sellers"
        label="Customer Favourites"
        products={bestSellers}
        viewAllHref="/shop?filter=bestseller"
      />
      <Newsletter />
    </>
  );
}


