"use client";

import { useEffect, useMemo } from "react";
import { useData } from "@/context/DataContext";
import { buildRevenueByBrand, buildRevenueByDate, getOfflineSalesTotals } from "@/lib/admin-stats";
import { formatCurrency } from "@/lib/format";
import { calcProfit } from "@/lib/types";
import { StatsCard } from "@/components/admin/StatsCard";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { BrandRevenueChart } from "@/components/admin/BrandRevenueChart";
import { DollarSign, TrendingUp, RefreshCw } from "lucide-react";

export default function AdminRevenuePage() {
  const { orders, allProducts, refreshOrders } = useData();

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const completedOrders = orders.filter((o) => o.status !== "Cancelled");
  const offlineTotals = getOfflineSalesTotals(allProducts, orders);
  const totalSales =
    completedOrders.reduce((sum, o) => sum + o.total, 0) + offlineTotals.revenue;
  const totalProfit =
    completedOrders.reduce(
      (sum, o) => sum + o.items.reduce((s, i) => s + calcProfit(i.discountPrice, i.purchasePrice), 0),
      0
    ) + offlineTotals.profit;
  const aov = completedOrders.length > 0 ? totalSales / completedOrders.length : 0;
  const refunds = orders.filter((o) => o.status === "Cancelled").reduce((sum, o) => sum + o.total, 0);

  const chartData = useMemo(() => buildRevenueByDate(orders, allProducts), [orders, allProducts]);
  const brandData = useMemo(() => buildRevenueByBrand(orders, allProducts), [orders, allProducts]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Sales" value={formatCurrency(totalSales)} icon={DollarSign} />
        <StatsCard title="Total Profit" value={formatCurrency(totalProfit)} icon={TrendingUp} trendUp />
        <StatsCard title="Avg Order Value" value={formatCurrency(aov)} icon={TrendingUp} />
        <StatsCard title="Refunds" value={formatCurrency(refunds)} icon={RefreshCw} />
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-stone-900">Revenue Over Time</h2>
        <div className="mt-4">
          <RevenueChart data={chartData} />
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-stone-900">Revenue by Brand</h2>
        <div className="mt-4">
          <BrandRevenueChart data={brandData} />
        </div>
      </div>
    </div>
  );
}
