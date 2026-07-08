"use client";

import { useMemo } from "react";
import {
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useData } from "@/context/DataContext";
import { getDashboardStats, mockRevenueDaily } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";
import { StatsCard } from "@/components/admin/StatsCard";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

export default function AdminDashboardPage() {
  const { products, orders } = useData();
  const stats = getDashboardStats(products, orders);

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 8),
    [orders]
  );

  const lowStockProducts = products
    .filter((p) => p.stock <= p.lowStockThreshold)
    .slice(0, 5);

  const ordersByStatus = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* Stats */}
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
          title="Low Stock"
          value={String(stats.lowStockItems)}
          icon={Package}
          trend={stats.lowStockItems > 0 ? "Requires attention" : "All good"}
          trendUp={stats.lowStockItems === 0}
        />
        <StatsCard
          title="Customers"
          value={String(stats.totalCustomers)}
          icon={Users}
          trend="Unique buyers"
          trendUp
        />
      </div>

      {/* Order status pills */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(ordersByStatus).map(([status, count]) => (
          <div
            key={status}
            className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 shadow-sm"
          >
            <Badge variant="secondary" className={`${statusColors[status]} text-xs`}>
              {status}
            </Badge>
            <span className="text-sm font-semibold text-stone-900">{count}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue chart */}
        <div className="lg:col-span-2 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-rose-400" />
            <h2 className="font-semibold text-stone-900">Revenue — Last 8 Days</h2>
          </div>
          <RevenueChart data={mockRevenueDaily} compact />
        </div>

        {/* Low stock alerts */}
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h2 className="font-semibold text-stone-900">Low Stock</h2>
          </div>
          {lowStockProducts.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-stone-400">
              <CheckCircle2 className="h-8 w-8 text-green-400" />
              <p className="mt-2 text-sm">All products well-stocked</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-stone-900 line-clamp-1">
                      {p.name}
                    </p>
                    <p className="text-xs text-stone-500">{p.sku}</p>
                  </div>
                  <Badge variant="secondary" className="bg-red-100 text-red-700 shrink-0">
                    {p.stock} left
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-rose-400" />
          <h2 className="font-semibold text-stone-900">Recent Orders</h2>
        </div>
        <OrdersTable orders={recentOrders} compact />
      </div>
    </div>
  );
}


