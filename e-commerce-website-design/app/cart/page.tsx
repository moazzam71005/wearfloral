'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useCartStore } from '@/lib/cart-store';
import { useAuthStore } from '@/lib/auth-store';
import { X, Minus, Plus, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!user || user.role !== 'user') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Please log in</h1>
          <p className="text-muted-foreground mb-6">You need to be logged in to view your cart</p>
          <Link href="/login" className="text-primary hover:underline">
            Go to login
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const totalPrice = getTotalPrice();
  const shipping = totalPrice > 5000 ? 0 : 200;
  const subtotal = totalPrice;
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + shipping + tax;

  const handleCheckout = async () => {
    setIsProcessing(true);
    // Simulate checkout
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    clearCart();
    router.push('/checkout-success');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-16 text-center">
            <ShoppingCart size={64} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Add some beautiful pieces to get started
            </p>
            <Link
              href="/shop"
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-2">Shopping Cart</h1>
        <p className="text-muted-foreground mb-8">{items.length} items</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 border border-border rounded-lg bg-card"
              >
                {/* Product Image */}
                <Link
                  href={`/product/${item.id}`}
                  className="h-24 w-24 rounded-lg overflow-hidden bg-secondary flex-shrink-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform"
                  />
                </Link>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div>
                      <Link
                        href={`/product/${item.id}`}
                        className="font-semibold text-foreground hover:text-primary transition line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-foreground transition flex-shrink-0"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="font-bold text-foreground">
                      PKR {item.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 rounded border border-border hover:bg-secondary transition flex items-center justify-center"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-6 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))
                        }
                        className="h-8 w-8 rounded border border-border hover:bg-secondary transition flex items-center justify-center"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right flex-shrink-0">
                  <p className="text-sm text-muted-foreground mb-2">Subtotal</p>
                  <p className="font-bold text-foreground">
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-bold text-foreground">Order Summary</h2>

              <div className="space-y-3 border-b border-border pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">PKR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Shipping
                    {shipping === 0 && <span className="text-green-600 ml-1">(Free)</span>}
                  </span>
                  <span className="text-foreground">
                    {shipping === 0 ? 'Free' : `PKR ${shipping.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span className="text-foreground">PKR {tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="font-bold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">
                  PKR {total.toLocaleString()}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing || items.length === 0}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
              </button>

              <button
                onClick={() => router.push('/shop')}
                className="w-full border border-border text-foreground py-3 rounded-lg font-semibold hover:bg-secondary transition"
              >
                Continue Shopping
              </button>

              {/* Info */}
              <div className="bg-secondary p-3 rounded text-xs text-muted-foreground">
                <p className="font-semibold text-foreground mb-2">Free shipping available!</p>
                <p>Free shipping on orders over PKR 5000</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
