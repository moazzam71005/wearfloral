'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/lib/cart-store';
import { useAuthStore } from '@/lib/auth-store';
import { useRouter } from 'next/navigation';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItems = useCartStore((state) => state.getTotalItems());
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">WF</span>
            </div>
            <span className="hidden font-bold text-foreground sm:inline">Wear Floral</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/shop" className="text-sm text-foreground hover:text-primary transition">
              Shop
            </Link>
            <Link href="/about" className="text-sm text-foreground hover:text-primary transition">
              About
            </Link>
            <Link href="/contact" className="text-sm text-foreground hover:text-primary transition">
              Contact
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {user && user.role === 'user' && (
              <Link
                href="/orders"
                className="hidden sm:flex text-sm text-foreground hover:text-primary transition items-center gap-2"
              >
                <User size={18} />
                Orders
              </Link>
            )}

            {user && user.role === 'admin' && (
              <Link
                href="/admin"
                className="hidden sm:flex text-sm bg-primary text-primary-foreground px-4 py-2 rounded transition hover:opacity-90"
              >
                Admin
              </Link>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="hidden sm:flex text-sm text-foreground hover:text-primary transition items-center gap-2"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex text-sm text-foreground hover:text-primary transition"
              >
                Login
              </Link>
            )}

            {user?.role === 'user' && (
              <Link
                href="/cart"
                className="relative text-foreground hover:text-primary transition"
              >
                <ShoppingCart size={20} />
                {cartItems > 0 && (
                  <span className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    {cartItems}
                  </span>
                )}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-foreground"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link
              href="/shop"
              className="block text-sm text-foreground hover:text-primary transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="block text-sm text-foreground hover:text-primary transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block text-sm text-foreground hover:text-primary transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            {user && user.role === 'user' && (
              <Link
                href="/orders"
                className="block text-sm text-foreground hover:text-primary transition py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                My Orders
              </Link>
            )}
            {user && user.role === 'admin' && (
              <Link
                href="/admin"
                className="block text-sm text-foreground hover:text-primary transition py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block text-sm text-foreground hover:text-primary transition py-2"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="block text-sm text-foreground hover:text-primary transition py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
