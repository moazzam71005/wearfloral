"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Box,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Warehouse,
  X,
} from "lucide-react";
import { STORE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/inventory", label: "Inventory", icon: Warehouse },
  { href: "/admin/revenue", label: "Revenue", icon: BarChart3 },
];

interface AdminSidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ mobile, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col bg-stone-900 text-white",
        mobile ? "h-full" : "hidden lg:flex lg:w-64 lg:fixed lg:inset-y-0 lg:z-40"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-stone-800 px-6">
        <Link href="/admin" className="flex items-center gap-2">
          <Box className="h-6 w-6 text-rose-400" />
          <span className="font-semibold">{STORE_NAME}</span>
        </Link>
        {mobile && onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-stone-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-rose-400/20 text-rose-400"
                  : "text-stone-400 hover:bg-stone-800 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-stone-800 p-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-stone-400 hover:text-white transition-colors"
        >
          View Storefront
        </Link>
      </div>
    </aside>
  );
}
