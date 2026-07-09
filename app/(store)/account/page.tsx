"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Package } from "lucide-react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useData } from "@/context/DataContext";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Order } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

export default function AccountPage() {
  const { isAuthenticated, isLoading, profile, user, signOut } = useCustomerAuth();
  const { fetchCustomerOrders } = useData();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login?next=/account");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!user) return;
    fetchCustomerOrders(user.id)
      .then(setOrders)
      .finally(() => setLoadingOrders(false));
  }, [user, fetchCustomerOrders]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">My Account</h1>
          <p className="mt-1 text-sm text-stone-500">{profile?.name} · {user?.email}</p>
        </div>
        <button
          onClick={() => signOut()}
          className="text-sm text-stone-500 hover:text-red-500"
        >
          Sign Out
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm">
        <p><span className="font-medium">Phone:</span> {profile?.phone}</p>
        <p className="mt-1"><span className="font-medium">Address:</span> {profile?.address}, {profile?.city}</p>
      </div>

      <h2 className="mt-10 text-lg font-semibold text-stone-900">Order History</h2>

      {loadingOrders ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-rose-400" />
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-8 text-center py-12">
          <Package className="mx-auto h-12 w-12 text-stone-300" />
          <p className="mt-4 text-stone-500">No orders yet</p>
          <Link href="/shop" className="mt-4 inline-block text-sm text-rose-500 hover:underline">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-stone-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-stone-900">{order.id}</p>
                  <p className="text-xs text-stone-500">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={statusColors[order.status]}>{order.status}</Badge>
                  <span className="font-semibold">{formatCurrency(order.total)}</span>
                </div>
              </div>
              <div className="mt-3 flex gap-3 overflow-x-auto">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex shrink-0 items-center gap-2">
                    <div className="relative h-14 w-12 overflow-hidden rounded bg-stone-100">
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="text-xs">
                      <p className="font-medium line-clamp-1">{item.name}</p>
                      <p className="text-stone-500">{item.brand}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
