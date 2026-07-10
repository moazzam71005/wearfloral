"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useData } from "@/context/DataContext";
import { formatCurrency } from "@/lib/format";
import { calcShippingFee } from "@/lib/shipping";
import type { Order, OrderItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  validateAddress,
  validateCity,
  validateName,
  validatePhone,
} from "@/lib/validation";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { placeOrder, products, allProducts } = useData();
  const { isAuthenticated, isLoading, profile, user } = useCustomerAuth();
  const router = useRouter();

  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login?next=/checkout");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
      });
    }
  }, [profile]);

  const shipping = calcShippingFee(items.length);
  const total = subtotal + (items.length > 0 ? shipping : 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const errors: Record<string, string> = {};
    const nameErr = validateName(form.name);
    const phoneErr = validatePhone(form.phone);
    const addrErr = validateAddress(form.address);
    const cityErr = validateCity(form.city);
    if (nameErr) errors.name = nameErr;
    if (phoneErr) errors.phone = phoneErr;
    if (addrErr) errors.address = addrErr;
    if (cityErr) errors.city = cityErr;
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const soldInCart = items.filter((item) =>
      allProducts.find((p) => p.id === item.productId)?.isSold
    );
    if (soldInCart.length > 0) {
      setError("One or more items in your cart are no longer available.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const id = `ORD-${Date.now()}`;
      const orderItems: OrderItem[] = items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return {
          productId: item.productId,
          name: item.name,
          imageUrl: item.imageUrl,
          brand: product?.brand ?? "",
          volume: product?.volume ?? "",
          displayPrice: item.displayPrice,
          discountPrice: item.discountPrice,
          purchasePrice: product?.purchasePrice ?? 0,
        };
      });

      const order: Omit<Order, "createdAt" | "updatedAt"> = {
        id,
        customerId: user.id,
        customerName: form.name,
        customerEmail: user.email ?? "",
        customerPhone: form.phone,
        shippingAddress: form.address,
        city: form.city,
        items: orderItems,
        subtotal,
        shipping,
        total,
        status: "Pending",
      };

      await placeOrder(order);
      clearCart();
      setOrderId(id);
      setPlaced(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-400" />
      </div>
    );
  }

  if (items.length === 0 && !placed) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-stone-500">No items to checkout.</p>
        <Button className="mt-4" asChild>
          <Link href="/shop">Go to Shop</Link>
        </Button>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-2xl font-bold">Order Placed!</h1>
        <p className="mt-2 text-stone-500">
          Your order ID is{" "}
          <span className="font-semibold text-stone-900">{orderId}</span>
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button className="bg-rose-500 hover:bg-rose-600 text-white" asChild>
            <Link href="/account">View Orders</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-stone-900">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Delivery Details</h2>
            <div className="mt-4 space-y-4">
              {[
                { id: "name", label: "Full Name" },
                { id: "phone", label: "Phone" },
                { id: "address", label: "Address" },
                { id: "city", label: "City" },
              ].map(({ id, label }) => (
                <div key={id}>
                  <Label htmlFor={id}>{label}</Label>
                  <Input
                    id={id}
                    required
                    value={form[id as keyof typeof form]}
                    onChange={(e) =>
                      setForm({ ...form, [id]: e.target.value })
                    }
                    className="mt-1"
                  />
                  {fieldErrors[id] && (
                    <p className="mt-1 text-xs text-red-500">{fieldErrors[id]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
            <p className="text-sm text-stone-600">
              Payment on delivery (Cash on Delivery).
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-stone-200 p-6 h-fit">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-3">
                <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded bg-stone-100">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium line-clamp-1">{item.name}</p>
                </div>
                <p className="text-sm font-medium">
                  {formatCurrency(item.discountPrice)}
                </p>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Shipping</span>
              <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="mt-6 w-full bg-rose-500 hover:bg-rose-600 text-white"
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Place Order
          </Button>
        </div>
      </form>
    </div>
  );
}
