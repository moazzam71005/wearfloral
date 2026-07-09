"use client";

import { useEffect, useMemo } from "react";
import {
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react";
import { useData } from "@/context/DataContext";
import { getDashboardStats, buildRevenueByDate } from "@/lib/admin-stats";
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
  const { products, orders, customers, refreshOrders, refreshCustomers } = useData();

  useEffect(() => {
    refreshOrders();
    refreshCustomers();
  }, [refreshOrders, refreshCustomers]);

  const stats = getDashboardStats(products, orders);
  const chartData = useMemo(() => buildRevenueByDate(orders), [orders]);

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8),
    [orders]
  );

  const ordersByStatus = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach((o) => { counts[o.status] = (counts[o.status] || 0) + 1; });
    return counts;
  }, [orders]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatsCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={DollarSign} trendUp />
        <StatsCard title="Total Profit" value={formatCurrency(stats.totalProfit)} icon={TrendingUp} trendUp />
        <StatsCard title="Orders Today" value={String(stats.ordersToday)} icon={ShoppingCart} />
        <StatsCard title="Customers" value={String(customers.length || stats.totalCustomers)} icon={Users} />
        <StatsCard title="Available Pieces" value={String(stats.availablePieces)} icon={Package} />
      </div>

      <div className="flex flex-wrap gap-3">
        {Object.entries(ordersByStatus).map(([status, count]) => (
          <div key={status} className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 shadow-sm">
            <Badge variant="secondary" className={`${statusColors[status]} text-xs`}>{status}</Badge>
            <span className="text-sm font-semibold">{count}</span>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-stone-900">Revenue Trend</h2>
        <RevenueChart data={chartData} compact />
      </div>

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
