'use client';

import Link from 'next/link';
import { Heart, Share2, MessageSquare, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">WF</span>
              </div>
              <h3 className="font-bold text-foreground">Wear Floral</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Your destination for authentic branded desi women&apos;s clothing with traditional elegance and modern style.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <nav className="space-y-2">
              <Link
                href="/shop"
                className="text-sm text-muted-foreground hover:text-primary transition"
              >
                Shop All
              </Link>
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-primary transition"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-primary transition"
              >
                Contact
              </Link>
              <Link
                href="/faq"
                className="text-sm text-muted-foreground hover:text-primary transition"
              >
                FAQ
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Customer Service</h4>
            <nav className="space-y-2">
              <Link
                href="/shipping"
                className="text-sm text-muted-foreground hover:text-primary transition"
              >
                Shipping Info
              </Link>
              <Link
                href="/returns"
                className="text-sm text-muted-foreground hover:text-primary transition"
              >
                Returns
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-primary transition"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-primary transition"
              >
                Terms & Conditions
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">+92 319 8555335</p>
                  <p className="text-xs text-muted-foreground">Mon-Fri 10AM-6PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">support@wearfloral.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; 2025 Wear Floral. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition"
                title="Instagram"
              >
                <Share2 size={20} />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition"
                title="Social"
              >
                <Heart size={20} />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition"
                title="Contact"
              >
                <MessageSquare size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
