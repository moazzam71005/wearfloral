"use client";

import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { CartProvider } from "@/context/CartContext";
import { DataProvider } from "@/context/DataContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <CartProvider>
        <AdminAuthProvider>{children}</AdminAuthProvider>
      </CartProvider>
    </DataProvider>
  );
}
