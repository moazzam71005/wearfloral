'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useAuthStore } from '@/lib/auth-store';
import { mockUser } from '@/lib/mock-data';
import Link from 'next/link';
import { Package, Calendar, MapPin, DollarSign } from 'lucide-react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const { user } = useAuthStore();

  if (!user || user.role !== 'user') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Please log in</h1>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to view your orders
          </p>
          <Link href="/login" className="text-primary hover:underline">
            Go to login
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Orders</h1>
        <p className="text-muted-foreground mb-8">
          Track and manage your orders from Wear Floral
        </p>

        {mockUser.orders.length === 0 ? (
          <div className="text-center py-16">
            <Package size={64} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              No orders yet
            </h2>
            <p className="text-muted-foreground mb-8">
              Start shopping to place your first order
            </p>
            <Link
              href="/shop"
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {mockUser.orders.map((order) => (
              <div key={order.id} className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition">
                {/* Order Header */}
                <div className="bg-card p-6 border-b border-border">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                      <p className="font-bold text-foreground text-lg">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                      <p className="font-semibold text-foreground">
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          statusColors[order.status]
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total</p>
                      <p className="font-bold text-primary text-lg">
                        PKR {order.total.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6 bg-background space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 rounded object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × PKR {item.price.toLocaleString()}
                        </p>
                      </div>
                      <p className="font-bold text-foreground">
                        PKR {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order Details */}
                <div className="bg-secondary p-6 border-t border-border">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex gap-3">
                      <MapPin size={20} className="text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Delivery Address</p>
                        <p className="text-foreground">{order.address}</p>
                      </div>
                    </div>
                    {order.deliveryDate && (
                      <div className="flex gap-3">
                        <Calendar size={20} className="text-primary flex-shrink-0" />
                        <div>
                          <p className="text-sm text-muted-foreground">Expected Delivery</p>
                          <p className="text-foreground">
                            {new Date(order.deliveryDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-3">
                      <DollarSign size={20} className="text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Payment Status</p>
                        <p className="text-foreground font-semibold">Paid</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
