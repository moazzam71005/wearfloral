import type { Order, Product } from "./types";

/** Available items first, sold items at the end (newest first within each group). */
export function sortProductsForDisplay(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    if (a.isSold !== b.isSold) return a.isSold ? 1 : -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

/** Products marked sold in admin without a matching online order. */
export function getOfflineSoldProducts(products: Product[], orders: Order[]): Product[] {
  const soldOnlineIds = new Set(
    orders.flatMap((order) => order.items.map((item) => item.productId))
  );
  return products.filter((product) => product.isSold && !soldOnlineIds.has(product.id));
}
