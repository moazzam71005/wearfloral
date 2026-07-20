"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/format";
import { calcShippingFee } from "@/lib/shipping";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export function CartDrawer() {
  const { items, subtotal, isOpen, closeCart, removeItem } = useCart();

  const shipping = calcShippingFee(items.length);
  const total = subtotal + (items.length > 0 ? shipping : 0);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex w-full flex-col px-6 sm:max-w-md sm:px-8">
        <SheetHeader className="px-0">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Cart ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="h-12 w-12 text-stone-300" />
            <p className="text-stone-500">Your cart is empty</p>
            <Button onClick={closeCart} asChild variant="outline">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto py-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <h4 className="line-clamp-2 text-sm font-medium">{item.name}</h4>
                    <p className="mt-1 text-sm font-semibold">
                      {formatCurrency(item.discountPrice)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-auto h-auto w-fit p-0 text-stone-400 hover:text-red-500"
                      onClick={() => removeItem(item.productId)}
                    >
                      <Trash2 className="mr-1 h-3.5 w-3.5" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-stone-200 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Shipping</span>
                <span>{formatCurrency(shipping)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <Button className="w-full gap-2 bg-[#25D366] text-white hover:bg-[#1ebe57]" asChild onClick={closeCart}>
                <Link href="/checkout">Checkout on WhatsApp</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/cart" onClick={closeCart}>View Cart</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
