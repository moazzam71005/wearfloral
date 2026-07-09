"use client";

import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { CartProvider } from "@/context/CartContext";
import { CustomerAuthProvider } from "@/context/CustomerAuthContext";
import { DataProvider } from "@/context/DataContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <CustomerAuthProvider>
        <CartProvider>
          <AdminAuthProvider>{children}</AdminAuthProvider>
        </CartProvider>
      </CustomerAuthProvider>
    </DataProvider>
  );
}
