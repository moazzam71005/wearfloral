'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useAuthStore } from '@/lib/auth-store';
import { mockProducts, mockOrders } from '@/lib/mock-data';
import Link from 'next/link';
import {
  BarChart3,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';

export default function AdminPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You need admin access to view this page
          </p>
          <Link href="/" className="text-primary hover:underline">
            Go back home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate metrics
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = mockOrders.length;
  const totalProducts = mockProducts.length;
  const lowStockProducts = mockProducts.filter((p) => p.stock < 10);
  const totalCustomers = new Set(mockOrders.map((o) => o.userId)).size;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}. Manage your store and track performance.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Revenue */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Total Revenue</h3>
              <DollarSign size={20} className="text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">
              PKR {totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 font-semibold">+12% from last month</p>
          </div>

          {/* Total Orders */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Total Orders</h3>
              <ShoppingCart size={20} className="text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{totalOrders}</p>
            <p className="text-xs text-muted-foreground">
              {mockOrders.filter((o) => o.status === 'delivered').length} completed
            </p>
          </div>

          {/* Total Products */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Products</h3>
              <Package size={20} className="text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{totalProducts}</p>
            <p className="text-xs text-orange-600 font-semibold">
              {lowStockProducts.length} low stock
            </p>
          </div>

          {/* Total Customers */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Customers</h3>
              <Users size={20} className="text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{totalCustomers}</p>
            <p className="text-xs text-muted-foreground">Active customers</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-4 border-b border-border">
            {['overview', 'products', 'orders', 'inventory'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-semibold text-sm transition border-b-2 ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Recent Orders */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 text-muted-foreground font-semibold">
                        Order ID
                      </th>
                      <th className="text-left py-2 px-2 text-muted-foreground font-semibold">
                        Date
                      </th>
                      <th className="text-left py-2 px-2 text-muted-foreground font-semibold">
                        Amount
                      </th>
                      <th className="text-left py-2 px-2 text-muted-foreground font-semibold">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockOrders.slice(-5).map((order) => (
                      <tr key={order.id} className="border-b border-border hover:bg-secondary">
                        <td className="py-3 px-2 font-semibold text-foreground">{order.id}</td>
                        <td className="py-3 px-2 text-foreground">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-2 font-bold text-primary">
                          PKR {order.total.toLocaleString()}
                        </td>
                        <td className="py-3 px-2">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-foreground">All Products</h2>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition">
                Add Product
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 text-muted-foreground font-semibold">
                      Product
                    </th>
                    <th className="text-left py-2 px-2 text-muted-foreground font-semibold">
                      Price
                    </th>
                    <th className="text-left py-2 px-2 text-muted-foreground font-semibold">
                      Stock
                    </th>
                    <th className="text-left py-2 px-2 text-muted-foreground font-semibold">
                      Category
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockProducts.map((product) => (
                    <tr key={product.id} className="border-b border-border hover:bg-secondary">
                      <td className="py-3 px-2 font-semibold text-foreground">
                        {product.name}
                      </td>
                      <td className="py-3 px-2 text-foreground">
                        PKR {product.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`font-semibold ${
                            product.stock < 10
                              ? 'text-orange-600'
                              : 'text-green-600'
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground">{product.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">All Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 text-muted-foreground font-semibold">
                      Order ID
                    </th>
                    <th className="text-left py-2 px-2 text-muted-foreground font-semibold">
                      Date
                    </th>
                    <th className="text-left py-2 px-2 text-muted-foreground font-semibold">
                      Items
                    </th>
                    <th className="text-left py-2 px-2 text-muted-foreground font-semibold">
                      Amount
                    </th>
                    <th className="text-left py-2 px-2 text-muted-foreground font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-secondary">
                      <td className="py-3 px-2 font-semibold text-foreground">{order.id}</td>
                      <td className="py-3 px-2 text-foreground">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2 text-foreground">{order.items.length}</td>
                      <td className="py-3 px-2 font-bold text-primary">
                        PKR {order.total.toLocaleString()}
                      </td>
                      <td className="py-3 px-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Low Stock Items</h2>
            {lowStockProducts.length === 0 ? (
              <p className="text-muted-foreground">No low stock items</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 text-muted-foreground font-semibold">
                        Product
                      </th>
                      <th className="text-left py-2 px-2 text-muted-foreground font-semibold">
                        Stock
                      </th>
                      <th className="text-left py-2 px-2 text-muted-foreground font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockProducts.map((product) => (
                      <tr key={product.id} className="border-b border-border hover:bg-secondary">
                        <td className="py-3 px-2 font-semibold text-foreground">
                          {product.name}
                        </td>
                        <td className="py-3 px-2 text-orange-600 font-bold">
                          {product.stock} items
                        </td>
                        <td className="py-3 px-2">
                          <button className="text-primary hover:underline text-xs font-semibold">
                            Restock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
