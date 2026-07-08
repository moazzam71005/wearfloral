"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { NAV_LINKS, STORE_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CartDrawer } from "./CartDrawer";

export function Navbar() {
  const { itemCount, openCart } = useCart();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/shop?search=${encodeURIComponent(search.trim())}`);
      setMobileOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="text-xl font-semibold tracking-tight text-stone-900">
              {STORE_NAME}
            </span>
          </Link>

          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <Input
                type="search"
                placeholder="Search lawn, kurtis, dupattas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-stone-200 bg-stone-50 focus-visible:ring-rose-400"
              />
            </div>
          </form>

          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-stone-600 hover:text-rose-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={openCart}
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full bg-rose-400 px-1 text-[10px] hover:bg-rose-400">
                  {itemCount}
                </Badge>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-stone-200 bg-white px-4 py-4 lg:hidden">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>
            <nav className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-stone-700 py-1"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
      <CartDrawer />
    </>
  );
}
