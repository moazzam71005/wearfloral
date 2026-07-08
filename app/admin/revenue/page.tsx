"use client";

import { useState } from "react";
import { useData } from "@/context/DataContext";
import {
  mockCategoryRevenue,
  mockRevenueDaily,
  mockRevenueMonthly,
  mockRevenueWeekly,
} from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";
import { StatsCard } from "@/components/admin/StatsCard";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { CategoryRevenueChart } from "@/components/admin/CategoryRevenueChart";
import { Button } from "@/components/ui/button";
import { DollarSign, RefreshCw, TrendingUp } from "lucide-react";

type Period = "daily" | "weekly" | "monthly";

export default function AdminRevenuePage() {
  const { orders } = useData();
  const [period, setPeriod] = useState<Period>("daily");

  const chartData =
    period === "daily"
      ? mockRevenueDaily
      : period === "weekly"
        ? mockRevenueWeekly
        : mockRevenueMonthly;

  const completedOrders = orders.filter((o) => o.status !== "Cancelled");
  const totalSales = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const aov =
    completedOrders.length > 0 ? totalSales / completedOrders.length : 0;
  const refunds = orders
    .filter((o) => o.status === "Cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard
          title="Average Order Value"
          value={formatCurrency(aov)}
          icon={TrendingUp}
        />
        <StatsCard
          title="Total Sales"
          value={formatCurrency(totalSales)}
          icon={DollarSign}
        />
        <StatsCard
          title="Refunds"
          value={formatCurrency(refunds)}
          icon={RefreshCw}
        />
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-semibold text-stone-900">Revenue Over Time</h2>
          <div className="flex gap-2">
            {(["daily", "weekly", "monthly"] as Period[]).map((p) => (
              <Button
                key={p}
                variant={period === p ? "default" : "outline"}
                size="sm"
                className={
                  period === p
                    ? "bg-rose-400 hover:bg-rose-500 text-white capitalize"
                    : "capitalize"
                }
                onClick={() => setPeriod(p)}
              >
                {p}
              </Button>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <RevenueChart data={chartData} />
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-stone-900">Revenue by Category</h2>
        <div className="mt-4">
          <CategoryRevenueChart data={mockCategoryRevenue} />
        </div>
      </div>
    </div>
  );
}
