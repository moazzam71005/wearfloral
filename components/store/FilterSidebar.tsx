"use client";

import type { ProductFilters } from "@/lib/types";
import { BRANDS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FilterSidebarProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export function FilterSidebar({
  filters,
  onChange,
  onClose,
  isMobile,
}: FilterSidebarProps) {
  const toggleBrand = (brand: string) => {
    const brands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onChange({ ...filters, brands });
  };

  const clearAll = () => {
    onChange({
      search: filters.search,
      brands: [],
      priceRange: [0, 50000],
      sort: filters.sort,
    });
    onClose?.();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-stone-900">Brand</h3>
        <div className="space-y-2">
          {BRANDS.map((brand) => (
            <div key={brand} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={filters.brands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
              />
              <Label htmlFor={`brand-${brand}`} className="text-sm font-normal">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-stone-900">Price Range (PKR)</h3>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.priceRange[0] || ""}
            onChange={(e) =>
              onChange({
                ...filters,
                priceRange: [Number(e.target.value) || 0, filters.priceRange[1]],
              })
            }
            className="text-sm"
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.priceRange[1] === 50000 ? "" : filters.priceRange[1]}
            onChange={(e) =>
              onChange({
                ...filters,
                priceRange: [filters.priceRange[0], Number(e.target.value) || 50000],
              })
            }
            className="text-sm"
          />
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={clearAll} className="w-full">
        Clear Filters
      </Button>

      {isMobile && onClose && (
        <Button
          className="w-full bg-rose-500 hover:bg-rose-600 text-white"
          onClick={onClose}
        >
          Apply Filters
        </Button>
      )}
    </div>
  );
}
