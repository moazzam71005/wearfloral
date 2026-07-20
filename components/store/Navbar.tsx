"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, Search, ShoppingBag, User, X, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { NAV_LINKS, FREE_SHIPPING_MESSAGE, PAYMENT_METHODS_LABEL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CartDrawer } from "./CartDrawer";

export function Navbar() {
  const { itemCount, openCart } = useCart();
  const { isAuthenticated, profile, signOut } = useCustomerAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/shop?search=${encodeURIComponent(search.trim())}`);
      setMobileOpen(false);
      setSearchOpen(false);
    }
  };

  return (
    <>
      <div className="bg-rose-500 py-2 text-center text-xs font-medium tracking-wide text-white sm:text-sm">
        {FREE_SHIPPING_MESSAGE} &nbsp;·&nbsp; {PAYMENT_METHODS_LABEL}
      </div>

      <header className="sticky top-0 z-50 border-b border-stone-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-24 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.png"
              alt="Wear Floral"
              width={280}
              height={112}
              className="h-20 w-auto object-contain sm:h-24"
              priority
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
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

          <div className="flex items-center gap-1">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <Input
                  autoFocus
                  type="search"
                  placeholder="Search fabrics…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 w-48 border-stone-200 text-sm focus-visible:ring-rose-400"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => setSearchOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </form>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="hidden sm:inline-flex"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label="Account"
                >
                  <User className="h-5 w-5" />
                </Button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-stone-200 bg-white py-2 shadow-lg">
                    <p className="px-4 py-2 text-xs text-stone-500 truncate">
                      {profile?.name || "Account"}
                    </p>
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => { signOut(); setUserMenuOpen(false); }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex text-sm font-medium text-stone-600 hover:text-rose-500 px-2"
              >
                Sign In
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={openCart}
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
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
          <div className="border-t border-stone-100 bg-white px-4 pb-4 pt-3 lg:hidden">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <Input
                  type="search"
                  placeholder="Search fabrics…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </form>
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-rose-500"
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link href="/account" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50">
                    My Orders
                  </Link>
                  <button onClick={() => { signOut(); setMobileOpen(false); }} className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-stone-700 hover:bg-stone-50">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-rose-500 hover:bg-stone-50">
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
      <CartDrawer />
    </>
  );
}
