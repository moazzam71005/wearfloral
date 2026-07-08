"use client";

import { BRANDS, COLORS, SIZES } from "@/lib/constants";
import type { Category, ProductFilters } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

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
  const toggleArray = <T extends string>(
    key: keyof ProductFilters,
    value: T
  ) => {
    const current = filters[key] as T[];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  const clearFilters = () => {
    onChange({
      ...filters,
      categories: [],
      brands: [],
      sizes: [],
      colors: [],
      priceRange: [0, 20000],
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 20000;

  return (
    <div className={`space-y-6 ${isMobile ? "p-4" : ""}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-stone-900">Filters</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-rose-500 hover:text-rose-600"
            >
              Clear all
            </Button>
          )}
          {isMobile && onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-medium text-stone-700">Category</h4>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <div key={cat.name} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat.slug}`}
                checked={filters.categories.includes(cat.name as Category)}
                onCheckedChange={() =>
                  toggleArray("categories", cat.name as Category)
                }
              />
              <Label
                htmlFor={`cat-${cat.slug}`}
                className="text-sm font-normal cursor-pointer"
              >
                {cat.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="mb-3 text-sm font-medium text-stone-700">
          Price Range (PKR)
        </h4>
        <Slider
          min={0}
          max={20000}
          step={500}
          value={filters.priceRange}
          onValueChange={(value) =>
            onChange({
              ...filters,
              priceRange: value as [number, number],
            })
          }
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-stone-500">
          <span>PKR {filters.priceRange[0].toLocaleString()}</span>
          <span>PKR {filters.priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="mb-3 text-sm font-medium text-stone-700">Size</h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <Button
              key={size}
              variant={filters.sizes.includes(size) ? "default" : "outline"}
              size="sm"
              className={
                filters.sizes.includes(size)
                  ? "bg-rose-400 hover:bg-rose-500 text-white"
                  : ""
              }
              onClick={() => toggleArray("sizes", size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="mb-3 text-sm font-medium text-stone-700">Color</h4>
        <div className="space-y-2">
          {COLORS.map((color) => (
            <div key={color} className="flex items-center gap-2">
              <Checkbox
                id={`color-${color}`}
                checked={filters.colors.includes(color)}
                onCheckedChange={() => toggleArray("colors", color)}
              />
              <Label
                htmlFor={`color-${color}`}
                className="text-sm font-normal cursor-pointer"
              >
                {color}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="mb-3 text-sm font-medium text-stone-700">Brand</h4>
        <div className="space-y-2">
          {BRANDS.map((brand) => (
            <div key={brand} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={filters.brands.includes(brand)}
                onCheckedChange={() => toggleArray("brands", brand)}
              />
              <Label
                htmlFor={`brand-${brand}`}
                className="text-sm font-normal cursor-pointer"
              >
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
