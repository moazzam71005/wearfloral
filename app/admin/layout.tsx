"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/orders": "Orders",
  "/admin/inventory": "Inventory",
  "/admin/revenue": "Revenue",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isAuthenticated && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [isAuthenticated, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-rose-400 border-t-transparent" />
      </div>
    );
  }

  const title = pageTitles[pathname] || "Admin";

  return (
    <div className="min-h-screen bg-stone-50">
      <AdminSidebar />
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <AdminSidebar mobile onClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="lg:pl-64">
        <AdminTopbar title={title} onMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
