import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { STORE_EMAIL, STORE_LOCATION, STORE_PHONE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-stone-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Image
              src="/logo.png"
              alt="Wear Floral"
              width={120}
              height={50}
              className="h-10 w-auto object-contain"
            />
            <p className="mt-4 text-sm leading-relaxed text-stone-500">
              Elegant desi fashion for the modern woman. Curated lawn suits,
              kurtis & festive wear.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-900">
              Shop
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-stone-500">
              {[
                { href: "/shop", label: "All Products" },
                { href: "/shop?filter=new", label: "New Arrivals" },
                { href: "/shop?filter=bestseller", label: "Best Sellers" },
                { href: "/shop?category=Lawn", label: "Lawn" },
                { href: "/shop?category=Kurtis", label: "Kurtis" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-rose-500 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-900">
              Help
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-stone-500">
              {[
                "Shipping Policy",
                "Returns & Exchanges",
                "Size Guide",
                "Track Order",
                "FAQs",
              ].map((item) => (
                <li key={item}>
                  <Link href="/shop" className="hover:text-rose-500 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-900">
              Get in Touch
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-stone-500">
              <li>
                <a
                  href={`mailto:${STORE_EMAIL}`}
                  className="flex items-center gap-2 hover:text-rose-500 transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  {STORE_EMAIL}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                {STORE_PHONE}
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                {STORE_LOCATION}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-stone-100 pt-8 sm:flex-row">
          <p className="text-xs text-stone-400">
            &copy; {new Date().getFullYear()} Wear Floral. All rights reserved.
          </p>
          <p className="text-xs text-stone-400">
            Crafted with love in Pakistan 🌸
          </p>
        </div>
      </div>
    </footer>
  );
}
