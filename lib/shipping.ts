import { SHIPPING_FEE } from "./constants";

/** Flat shipping fee for any non-empty cart. */
export function calcShippingFee(itemCount: number): number {
  if (itemCount <= 0) return 0;
  return SHIPPING_FEE;
}
