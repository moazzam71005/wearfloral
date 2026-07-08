'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Check, Package } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative h-24 w-24">
              <div className="absolute inset-0 bg-primary/20 rounded-full" />
              <div className="absolute inset-2 bg-primary rounded-full flex items-center justify-center">
                <Check size={48} className="text-primary-foreground" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Order Confirmed!
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4 text-left">
            <div className="flex items-start gap-3">
              <Package size={20} className="text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-bold text-foreground text-lg">
                  ORD-{Math.random().toString(36).substring(2, 8).toUpperCase()}
                </p>
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground mb-2">What&apos;s next?</p>
              <ul className="space-y-2 text-sm text-foreground">
                <li>✓ Order confirmation sent to your email</li>
                <li>✓ We&apos;ll prepare your order</li>
                <li>✓ Get tracking info within 24 hours</li>
                <li>✓ Delivery in 2-3 business days</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/orders"
              className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition text-center"
            >
              View My Orders
            </Link>
            <Link
              href="/shop"
              className="flex-1 border border-border text-foreground py-3 rounded-lg font-semibold hover:bg-secondary transition text-center"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Info */}
          <div className="bg-secondary p-4 rounded-lg text-sm text-muted-foreground">
            <p className="mb-2 font-semibold text-foreground">Need Help?</p>
            <p>Contact us at support@wearfloral.com or call +92 300 1234567</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
