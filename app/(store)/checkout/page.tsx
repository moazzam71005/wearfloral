"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle, Loader2, MessageCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useData } from "@/context/DataContext";
import { CHECKOUT_NOTE } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import { calcShippingFee } from "@/lib/shipping";
import type { Order, OrderItem } from "@/lib/types";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  validateAddress,
  validateCity,
  validateEmail,
  validateName,
  validatePhone,
} from "@/lib/validation";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { placeOrder, allProducts } = useData();
  const { profile, user } = useCustomerAuth();

  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    setForm((prev) => ({
      name: profile?.name || prev.name,
      email: user?.email || prev.email,
      phone: profile?.phone || prev.phone,
      address: profile?.address || prev.address,
      city: profile?.city || prev.city,
    }));
  }, [profile, user]);

  const shipping = calcShippingFee(items.length);
  const total = subtotal + (items.length > 0 ? shipping : 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    const nameErr = validateName(form.name);
    const emailErr = validateEmail(form.email);
    const phoneErr = validatePhone(form.phone);
    const addrErr = validateAddress(form.address);
    const cityErr = validateCity(form.city);
    if (nameErr) errors.name = nameErr;
    if (emailErr) errors.email = emailErr;
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
        const product = allProducts.find((p) => p.id === item.productId);
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
        customerId: user?.id ?? null,
        customerName: form.name.trim(),
        customerEmail: form.email.trim(),
        customerPhone: form.phone.trim(),
        shippingAddress: form.address.trim(),
        city: form.city.trim(),
        items: orderItems,
        subtotal,
        shipping,
        total,
        status: "Pending",
      };

      await placeOrder(order, { markSold: false });

      const url = buildWhatsAppOrderUrl({
        orderId: id,
        items: items.map((item) => {
          const product = allProducts.find((p) => p.id === item.productId);
          return {
            ...item,
            productCode: product?.productCode,
            brand: product?.brand,
          };
        }),
        subtotal,
        shipping,
        total,
        customerName: form.name.trim(),
        customerEmail: form.email.trim(),
        customerPhone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
      });

      clearCart();
      setOrderId(id);
      setWhatsappUrl(url);
      setPlaced(true);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start WhatsApp order");
    } finally {
      setSubmitting(false);
    }
  };

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
        <h1 className="mt-4 text-2xl font-bold">Order request saved</h1>
        <p className="mt-2 text-stone-500">
          Your order ID is{" "}
          <span className="font-semibold text-stone-900">{orderId}</span>
        </p>
        <p className="mt-3 text-sm text-stone-500">
          Finish the chat on WhatsApp so we can confirm availability and payment.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {whatsappUrl && (
            <Button className="gap-2 bg-[#25D366] text-white hover:bg-[#1ebe57]" asChild>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                Open WhatsApp again
              </a>
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href="/shop">Continue shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-stone-900">Checkout</h1>
      <p className="mt-2 max-w-2xl text-sm text-stone-500">{CHECKOUT_NOTE}</p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Your details</h2>
            <div className="mt-4 space-y-4">
              {[
                { id: "name", label: "Full Name", type: "text" },
                { id: "email", label: "Email", type: "email" },
                { id: "phone", label: "Phone", type: "tel" },
                { id: "address", label: "Address", type: "text" },
                { id: "city", label: "City", type: "text" },
              ].map(({ id, label, type }) => (
                <div key={id}>
                  <Label htmlFor={id}>{label}</Label>
                  <Input
                    id={id}
                    type={type}
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

          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-medium text-emerald-900">Payment &amp; how it works</p>
            <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-sm text-emerald-800">
              <li>Enter your details (no account needed).</li>
              <li>Tap Order on WhatsApp — your cart is sent in the chat.</li>
              <li>
                We share <strong>EasyPaisa</strong>, <strong>JazzCash</strong>, or{" "}
                <strong>bank transfer</strong> account details on WhatsApp.
              </li>
              <li>Pay, send proof in the chat, then we ship your order.</li>
            </ol>
          </div>
        </div>

        <div className="h-fit rounded-xl border border-stone-200 p-6">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-3">
                <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded bg-stone-100">
                  <Image
                    src={item.imageUrl || "/placeholder-product.svg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 text-sm">
                  <p className="line-clamp-1 font-medium">{item.name}</p>
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
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="mt-6 w-full gap-2 bg-[#25D366] text-white hover:bg-[#1ebe57]"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MessageCircle className="h-4 w-4" />
            )}
            {submitting ? "Preparing…" : "Order on WhatsApp"}
          </Button>
          <p className="mt-3 text-center text-xs text-stone-400">
            Opens WhatsApp with your order details pre-filled
          </p>
        </div>
      </form>
    </div>
  );
}
