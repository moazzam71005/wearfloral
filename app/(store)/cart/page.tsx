"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/format";
import { calcShippingFee } from "@/lib/shipping";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const { items, subtotal, removeItem, clearCart } = useCart();

  const shipping = calcShippingFee(items.length);
  const total = subtotal + (items.length > 0 ? shipping : 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <ShoppingBag className="mx-auto h-16 w-16 text-stone-300" />
        <h1 className="mt-4 text-2xl font-bold text-stone-900">Your cart is empty</h1>
        <p className="mt-2 text-stone-500">Browse our unstitched fabric collection.</p>
        <Button className="mt-6 bg-rose-500 hover:bg-rose-600 text-white" asChild>
          <Link href="/shop">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-stone-900">Shopping Cart</h1>
      <p className="mt-1 text-stone-500">{items.length} item{items.length !== 1 ? "s" : ""}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 rounded-xl border border-stone-200 p-4">
              <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col">
                <Link href={`/product/${item.productId}`} className="font-medium text-stone-900 hover:text-rose-500">
                  {item.name}
                </Link>
                <p className="mt-1 font-semibold">{formatCurrency(item.discountPrice)}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-auto w-fit text-stone-400 hover:text-red-500"
                  onClick={() => removeItem(item.productId)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Remove
                </Button>
              </div>
            </div>
          ))}
          <Button variant="ghost" onClick={clearCart} className="text-stone-500">Clear Cart</Button>
        </div>

        <div className="rounded-xl border border-stone-200 p-6 h-fit">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Shipping</span>
              <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          <Button className="mt-6 w-full bg-rose-500 hover:bg-rose-600 text-white" size="lg" asChild>
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
