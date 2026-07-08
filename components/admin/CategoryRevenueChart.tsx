"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { CategoryRevenue } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

interface CategoryRevenueChartProps {
  data: CategoryRevenue[];
}

export function CategoryRevenueChart({ data }: CategoryRevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
        <XAxis
          type="number"
          tick={{ fontSize: 12, fill: "#78716c" }}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
        />
        <YAxis
          type="category"
          dataKey="category"
          tick={{ fontSize: 12, fill: "#78716c" }}
          width={120}
        />
        <Tooltip
          formatter={(value) => [
            formatCurrency(Number(value ?? 0)),
            "Revenue",
          ]}
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid #e7e5e4",
            fontSize: "13px",
          }}
        />
        <Bar dataKey="revenue" fill="#fb7185" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
