import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { STORE_EMAIL, STORE_LOCATION, STORE_PHONE, BRANDS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-stone-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image src="/logo.png" alt="Wear Floral" width={280} height={112} className="h-20 w-auto object-contain" />
            <p className="mt-4 text-sm leading-relaxed text-stone-500">
              Premium unstitched fabrics from renowned Pakistani brands.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-900">Brands</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-stone-500">
              {BRANDS.map((brand) => (
                <li key={brand}>
                  <Link href={`/shop?brand=${encodeURIComponent(brand)}`} className="hover:text-rose-500">
                    {brand}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-900">Help</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-stone-500">
              <li><Link href="/shop" className="hover:text-rose-500">Shop</Link></li>
              <li><Link href="/account" className="hover:text-rose-500">My Orders</Link></li>
              <li><Link href="/login" className="hover:text-rose-500">Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-900">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-stone-500">
              <li>
                <a href={`mailto:${STORE_EMAIL}`} className="flex items-center gap-2 hover:text-rose-500">
                  <Mail className="h-4 w-4 shrink-0" />{STORE_EMAIL}
                </a>
              </li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" />{STORE_PHONE}</li>
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 shrink-0 mt-0.5" />{STORE_LOCATION}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-stone-100 pt-8 text-center text-xs text-stone-400">
          &copy; {new Date().getFullYear()} Wear Floral. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
