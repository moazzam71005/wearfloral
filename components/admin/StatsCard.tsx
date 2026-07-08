import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-stone-200 bg-white p-5 shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-stone-500">{title}</p>
        <div className="rounded-lg bg-rose-50 p-2">
          <Icon className="h-5 w-5 text-rose-400" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold text-stone-900">{value}</p>
      {trend && (
        <p
          className={cn(
            "mt-1 text-xs font-medium",
            trendUp ? "text-green-600" : "text-stone-400"
          )}
        >
          {trend}
        </p>
      )}
    </div>
  );
}
