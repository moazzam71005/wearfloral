"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[70vh] grid-cols-1 items-center gap-8 py-12 md:grid-cols-2 md:py-16">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-rose-500">
                Premium Unstitched Fabrics
              </p>
              <h1 className="mt-3 font-heading text-4xl font-bold leading-tight text-stone-900 sm:text-5xl lg:text-6xl">
                Branded Fabrics,{" "}
                <span className="text-rose-500">Discounted </span> Prices
              </h1>
              <p className="mt-4 max-w-md text-base text-stone-500 sm:text-lg">
                Discover unique unstitched pieces from Sapphire, Gul Ahmed, Khaadi, Nishat
                and more!
              </p>
            </div>

            <form onSubmit={handleSearch} className="flex max-w-md">
              <input
                type="text"
                placeholder="Search by brand or fabric…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 rounded-l-xl border border-r-0 border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20"
              />
              <button
                type="submit"
                className="flex items-center gap-2 rounded-r-xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-600"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </form>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white hover:bg-stone-700"
              >
                Shop All Fabrics
              </Link>
              <Link
                href="#brands"
                className="rounded-xl border-2 border-stone-900 px-6 py-3 text-sm font-semibold text-stone-900 hover:bg-stone-900 hover:text-white"
              >
                Browse Brands
              </Link>
            </div>
          </div>

          <div className="relative aspect-square overflow-hidden rounded-3xl bg-rose-50 md:aspect-[4/5]">
            <Image
              src="/T56A5773-scaled.png"
              alt="Wear Floral Fabrics"
              fill
              className="object-cover object-top"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
