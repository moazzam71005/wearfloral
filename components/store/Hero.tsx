"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RotateCcw, Search, ShieldCheck, Truck } from "lucide-react";

export function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="bg-white">
      {/* Main hero */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[80vh] grid-cols-1 items-center gap-8 py-16 md:grid-cols-2 md:py-20">
          {/* Left: Text + Search */}
          <div className="space-y-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-rose-500">
                New Collection · Summer 2026
              </p>
              <h1 className="mt-4 font-heading text-5xl font-bold leading-tight text-stone-900 sm:text-6xl">
                Embrace Your{" "}
                <span className="text-rose-500">Cultural</span> Grace
              </h1>
              <p className="mt-5 max-w-md text-lg text-stone-500">
                Discover our exclusive collection of branded desi women&apos;s
                clothing — crafted with elegance, tradition, and modern flair.
              </p>
            </div>

            {/* Integrated search */}
            <form onSubmit={handleSearch} className="flex max-w-md">
              <input
                type="text"
                placeholder="Search kurtis, lawn suits, dupattas…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 rounded-l-xl border border-r-0 border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20"
              />
              <button
                type="submit"
                className="flex items-center gap-2 rounded-r-xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </form>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="rounded-xl bg-stone-900 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-700"
              >
                Shop Now
              </Link>
              <Link
                href="#categories"
                className="rounded-xl border-2 border-stone-900 px-8 py-3.5 text-sm font-semibold text-stone-900 transition hover:bg-stone-900 hover:text-white"
              >
                Explore Categories
              </Link>
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-rose-50 md:aspect-[4/5]">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-rose-500/20 via-transparent to-transparent" />
            <Image
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=85"
              alt="Wear Floral Collection"
              fill
              className="object-cover object-top"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>

      {/* Feature strip */}
      <div className="border-t border-stone-100 bg-stone-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 py-10 sm:grid-cols-3">
            {[
              {
                icon: Truck,
                title: "Free Shipping",
                desc: "On orders above PKR 5,000",
              },
              {
                icon: RotateCcw,
                title: "Easy Returns",
                desc: "30-day return policy",
              },
              {
                icon: ShieldCheck,
                title: "100% Authentic",
                desc: "Branded products only",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
                  <Icon className="h-5 w-5 text-rose-500" />
                </div>
                <h3 className="mt-3 font-semibold text-stone-900">{title}</h3>
                <p className="mt-1 text-sm text-stone-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
