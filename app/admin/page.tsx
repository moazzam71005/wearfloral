"use client";

import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { useData } from "@/context/DataContext";
import { getDashboardStats, mockRevenueDaily } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";
import { StatsCard } from "@/components/admin/StatsCard";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { RevenueChart } from "@/components/admin/RevenueChart";

export default function AdminDashboardPage() {
  const { products, orders } = useData();
  const stats = getDashboardStats(products, orders);
  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={DollarSign}
          trend="+12% from last month"
          trendUp
        />
        <StatsCard
          title="Orders Today"
          value={String(stats.ordersToday)}
          icon={ShoppingCart}
          trend={`${orders.length} total orders`}
        />
        <StatsCard
          title="Low Stock Items"
          value={String(stats.lowStockItems)}
          icon={Package}
          trend={stats.lowStockItems > 0 ? "Needs attention" : "All good"}
          trendUp={stats.lowStockItems === 0}
        />
        <StatsCard
          title="Total Customers"
          value={String(stats.totalCustomers)}
          icon={Users}
          trend="Unique buyers"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-stone-900">Revenue (Last 7 Days)</h2>
          <div className="mt-4">
            <RevenueChart data={mockRevenueDaily} compact />
          </div>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-stone-900">Recent Orders</h2>
          <div className="mt-4">
            <OrdersTable orders={recentOrders} compact />
          </div>
        </div>
      </div>
    </div>
  );
}
