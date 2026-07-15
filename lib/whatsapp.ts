import { STORE_NAME, STORE_WHATSAPP_NUMBER } from "./constants";
import { formatCurrency } from "./format";
import type { CartItem } from "./types";

export interface WhatsAppOrderDetails {
  orderId: string;
  items: (CartItem & { productCode?: string; brand?: string })[];
  subtotal: number;
  shipping: number;
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
}

/** Digits only for wa.me links (Pakistan: 923XXXXXXXXX). */
export function getWhatsAppDigits(phone = STORE_WHATSAPP_NUMBER): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return `92${digits.slice(1)}`;
  if (digits.startsWith("92")) return digits;
  return digits;
}

export function buildWhatsAppOrderMessage(details: WhatsAppOrderDetails): string {
  const lines = details.items.map((item) => {
    const code = item.productCode ? ` (${item.productCode})` : "";
    const brand = item.brand ? ` — ${item.brand}` : "";
    return `• ${item.name}${code}${brand} — ${formatCurrency(item.discountPrice)}`;
  });

  return [
    `Hi ${STORE_NAME}! I'd like to order:`,
    "",
    `Order ID: ${details.orderId}`,
    "",
    ...lines,
    "",
    `Subtotal: ${formatCurrency(details.subtotal)}`,
    `Shipping: ${details.shipping === 0 ? "Free" : formatCurrency(details.shipping)}`,
    `Total: ${formatCurrency(details.total)}`,
    "",
    `Name: ${details.customerName}`,
    `Email: ${details.customerEmail}`,
    `Phone: ${details.customerPhone}`,
    `Address: ${details.address}`,
    `City: ${details.city}`,
    "",
    "Please confirm availability and payment details. I can send payment proof here.",
  ].join("\n");
}

export function buildWhatsAppOrderUrl(details: WhatsAppOrderDetails): string {
  const text = encodeURIComponent(buildWhatsAppOrderMessage(details));
  return `https://wa.me/${getWhatsAppDigits()}?text=${text}`;
}
