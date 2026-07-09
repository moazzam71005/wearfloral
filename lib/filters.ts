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
        p.productCode.toLowerCase().includes(q) ||
        p.volume.toLowerCase().includes(q)
    );
  }

  if (filters.brands.length > 0) {
    result = result.filter((p) => filters.brands.includes(p.brand));
  }

  result = result.filter(
    (p) =>
      p.discountPrice >= filters.priceRange[0] &&
      p.discountPrice <= filters.priceRange[1]
  );

  switch (filters.sort) {
    case "price-asc":
      result.sort((a, b) => a.discountPrice - b.discountPrice);
      break;
    case "price-desc":
      result.sort((a, b) => b.discountPrice - a.discountPrice);
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
  brands: [],
  priceRange: [0, 50000],
  sort: "newest",
};

export function getRelatedProducts(
  products: Product[],
  product: Product,
  limit = 4
): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.brand === product.brand && !p.isSold)
    .slice(0, limit);
}
