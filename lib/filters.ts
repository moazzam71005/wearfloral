import type { Product, ProductFilters } from "./types";

export function filterProducts(
  products: Product[],
  filters: ProductFilters
): Product[] {
  let result = [...products];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  if (filters.categories.length > 0) {
    result = result.filter((p) => filters.categories.includes(p.category));
  }

  if (filters.brands.length > 0) {
    result = result.filter((p) => filters.brands.includes(p.brand));
  }

  if (filters.sizes.length > 0) {
    result = result.filter((p) =>
      p.sizes.some((s) => filters.sizes.includes(s))
    );
  }

  if (filters.colors.length > 0) {
    result = result.filter((p) =>
      p.colors.some((c) => filters.colors.includes(c))
    );
  }

  result = result.filter(
    (p) =>
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
  );

  switch (filters.sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "popular":
      result.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case "newest":
    default:
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
  }

  return result;
}

export const defaultFilters: ProductFilters = {
  search: "",
  categories: [],
  brands: [],
  sizes: [],
  colors: [],
  priceRange: [0, 20000],
  sort: "newest",
};
