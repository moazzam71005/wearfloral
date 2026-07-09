"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, Loader2 } from "lucide-react";
import { useData } from "@/context/DataContext";
import { ProductCard } from "@/components/store/ProductCard";
import { FilterSidebar } from "@/components/store/FilterSidebar";
import { defaultFilters, filterProducts } from "@/lib/filters";
import type { ProductFilters, SortOption } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function ShopPage() {
  const { products, isLoading } = useData();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<ProductFilters>(defaultFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 12;

  useEffect(() => {
    const search = searchParams.get("search") || "";
    const brand = searchParams.get("brand");
    setFilters((prev) => ({
      ...prev,
      search,
      brands: brand ? [brand] : prev.brands,
    }));
  }, [searchParams]);

  const filteredProducts = useMemo(
    () => filterProducts(products, filters),
    [products, filters]
  );

  const paginatedProducts = useMemo(
    () => filteredProducts.slice(0, page * perPage),
    [filteredProducts, page]
  );

  const hasMore = paginatedProducts.length < filteredProducts.length;

  const handleSortChange = useCallback((value: string | null) => {
    if (!value) return;
    setFilters((prev) => ({ ...prev, sort: value as SortOption }));
    setPage(1);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900">Shop Fabrics</h1>
        <p className="mt-1 text-stone-500">
          {filteredProducts.length} piece{filteredProducts.length !== 1 ? "s" : ""} available
        </p>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-xl border border-stone-200 p-5">
            <FilterSidebar filters={filters} onChange={setFilters} />
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between gap-4">
            <Button
              variant="outline"
              className="lg:hidden gap-2"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
            <Select value={filters.sort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px] ml-auto">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-stone-500">No fabrics match your filters.</p>
              <Button variant="outline" className="mt-4" onClick={() => setFilters(defaultFilters)}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {hasMore && (
                <div className="mt-10 text-center">
                  <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="left" className="w-full sm:max-w-sm overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            onClose={() => setMobileFiltersOpen(false)}
            isMobile
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
