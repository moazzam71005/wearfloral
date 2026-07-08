"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { RevenueDataPoint } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

interface RevenueChartProps {
  data: RevenueDataPoint[];
  compact?: boolean;
}

export function RevenueChart({ data, compact }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={compact ? 200 : 320}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: "#78716c" }}
          axisLine={{ stroke: "#e7e5e4" }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#78716c" }}
          axisLine={{ stroke: "#e7e5e4" }}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
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
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#fb7185"
          strokeWidth={2}
          dot={{ fill: "#fb7185", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
