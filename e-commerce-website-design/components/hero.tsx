'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-16 md:py-24 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Embrace Your{' '}
                <span className="text-primary">Cultural Grace</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Discover our exclusive collection of branded desi women&apos;s clothing, crafted with elegance and tradition.
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search for kurtis, sarees, lehengas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-l-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-r-lg hover:opacity-90 transition flex items-center gap-2"
              >
                <Search size={20} />
                <span className="hidden sm:inline">Search</span>
              </button>
            </form>

            {/* CTA Buttons */}
            <div className="flex gap-4 pt-4">
              <Link
                href="/shop"
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Shop Now
              </Link>
              <Link
                href="#categories"
                className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition"
              >
                Explore Categories
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-96 md:h-full rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent z-10" />
            <img
              src="https://images.unsplash.com/photo-1610204388537-b7fbfb7fb523?w=600&h=600&fit=crop"
              alt="Wear Floral Collection"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Features Below Hero */}
      <div className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">On orders above PKR 5000</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Easy Returns</h3>
              <p className="text-sm text-muted-foreground">30-day return policy</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💯</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">100% Authentic</h3>
              <p className="text-sm text-muted-foreground">Branded products only</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
