"use client";

import { useData } from "@/context/DataContext";
import { Hero } from "@/components/store/Hero";
import { CategoryCards } from "@/components/store/CategoryCards";
import { ProductRow, ProductGrid } from "@/components/store/ProductRow";
import { SearchBar } from "@/components/store/SearchBar";
import { Newsletter } from "@/components/store/Newsletter";

export default function HomePage() {
  const { products } = useData();

  const newArrivals = products.filter((p) => p.isNewArrival);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);

  return (
    <>
      <Hero />
      <SearchBar sticky />
      <CategoryCards />
      <ProductRow
        title="New Arrivals"
        subtitle="Fresh styles just landed"
        products={newArrivals}
        viewAllHref="/shop?filter=new"
      />
      <ProductGrid title="Best Sellers" products={bestSellers} />
      <Newsletter />
    </>
  );
}
