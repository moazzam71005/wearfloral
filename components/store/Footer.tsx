import Link from "next/link";
import { Mail, MapPin, Phone, Share2 } from "lucide-react";
import { STORE_NAME, STORE_TAGLINE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold text-stone-900">
              {STORE_NAME}
            </h3>
            <p className="mt-2 text-sm text-stone-500">{STORE_TAGLINE}</p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-rose-500 transition-colors"
                aria-label="Instagram"
              >
                <Share2 className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-stone-900">Shop</h4>
            <ul className="mt-3 space-y-2 text-sm text-stone-500">
              <li>
                <Link href="/shop" className="hover:text-rose-500">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=new" className="hover:text-rose-500">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?filter=bestseller"
                  className="hover:text-rose-500"
                >
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-stone-900">Help</h4>
            <ul className="mt-3 space-y-2 text-sm text-stone-500">
              <li>
                <Link href="/shop" className="hover:text-rose-500">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-rose-500">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-rose-500">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-stone-900">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm text-stone-500">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                hello@wearfloral.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +92 300 0000000
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                Lahore, Pakistan
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-stone-200 pt-6 text-center text-sm text-stone-400">
          <p>
            &copy; {new Date().getFullYear()} {STORE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
