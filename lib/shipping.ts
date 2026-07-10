import { FREE_SHIPPING_MIN_ITEMS, SHIPPING_FEE } from "./constants";

export function calcShippingFee(itemCount: number): number {
  if (itemCount <= 0) return 0;
  return itemCount >= FREE_SHIPPING_MIN_ITEMS ? 0 : SHIPPING_FEE;
}

export function itemsUntilFreeShipping(itemCount: number): number {
  return Math.max(0, FREE_SHIPPING_MIN_ITEMS - itemCount);
}
