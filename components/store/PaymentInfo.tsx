import { MessageCircle, Smartphone, Building2 } from "lucide-react";
import {
  PAYMENT_METHODS_LABEL,
  PAYMENT_HOWITWORKS,
} from "@/lib/constants";

export function PaymentInfo() {
  return (
    <section
      id="payment"
      className="border-y border-stone-100 bg-white py-10 sm:py-12"
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-400">
          Payment
        </p>
        <h2 className="mt-3 font-heading text-2xl font-bold text-stone-900 sm:text-3xl">
          EasyPaisa, JazzCash, or bank transfer
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-stone-500 sm:text-base">
          {PAYMENT_HOWITWORKS}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-stone-50 px-4 py-5">
            <Smartphone className="mx-auto h-5 w-5 text-rose-400" />
            <p className="mt-3 text-sm font-semibold text-stone-900">EasyPaisa</p>
          </div>
          <div className="rounded-2xl bg-stone-50 px-4 py-5">
            <Smartphone className="mx-auto h-5 w-5 text-rose-400" />
            <p className="mt-3 text-sm font-semibold text-stone-900">JazzCash</p>
          </div>
          <div className="rounded-2xl bg-stone-50 px-4 py-5">
            <Building2 className="mx-auto h-5 w-5 text-rose-400" />
            <p className="mt-3 text-sm font-semibold text-stone-900">Bank transfer</p>
          </div>
        </div>

        <p className="mt-6 inline-flex items-center gap-2 text-sm text-stone-600">
          <MessageCircle className="h-4 w-4 text-[#25D366]" />
          Account number &amp; details are shared on WhatsApp after you checkout
        </p>
        <p className="mt-2 text-xs text-stone-400">{PAYMENT_METHODS_LABEL}</p>
      </div>
    </section>
  );
}
