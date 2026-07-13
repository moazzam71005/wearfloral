"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useData } from "@/context/DataContext";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { calcProfit } from "@/lib/types";
import type { Order, OrderStatus } from "@/lib/types";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const statuses: (OrderStatus | "All")[] = [
  "All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled",
];

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, refreshOrders } = useData();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const filtered = statusFilter === "All" ? orders : orders.filter((o) => o.status === statusFilter);
  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
        <p className="font-medium">WhatsApp orders</p>
        <p className="mt-1 text-emerald-800">
          New checkouts arrive as <strong>Pending</strong> and do not mark pieces sold.
          After payment proof on WhatsApp, set status to <strong>Processing</strong> (or Shipped / Delivered) — that marks the items sold out.
          Use <strong>Cancelled</strong> if you do not approve the order (no payment). Cancelled orders do not count as refunds, and the pieces go back on the shop.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            size="sm"
            className={statusFilter === status ? "bg-rose-500 hover:bg-rose-600 text-white" : ""}
            onClick={() => setStatusFilter(status)}
          >
            {status}
          </Button>
        ))}
      </div>

      <OrdersTable orders={sorted} onSelect={setSelectedOrder} />

      <Sheet open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <SheetContent className="w-full overflow-y-auto px-6 sm:max-w-md sm:px-8">
          {selectedOrder && (
            <>
              <SheetHeader className="px-0">
                <SheetTitle>Order {selectedOrder.id}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm font-medium text-stone-500">Status</p>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={async (v) => {
                      if (!v) return;
                      await updateOrderStatus(selectedOrder.id, v as OrderStatus);
                      setSelectedOrder({ ...selectedOrder, status: v as OrderStatus });
                    }}
                  >
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {statuses.filter((s) => s !== "All").map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedOrder.status === "Pending" && (
                    <p className="mt-2 text-xs text-stone-500">
                      Waiting for WhatsApp confirmation. Move to Processing after payment proof to mark items sold.
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-stone-500">Customer</p>
                  <p className="mt-1">{selectedOrder.customerName}</p>
                  <p className="text-sm text-stone-500">{selectedOrder.customerEmail}</p>
                  <p className="text-sm text-stone-500">{selectedOrder.customerPhone}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-stone-500">Shipping</p>
                  <p className="mt-1 text-sm">{selectedOrder.shippingAddress}</p>
                  <p className="text-sm">{selectedOrder.city}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-stone-500 mb-3">Items</p>
                  {selectedOrder.items.map((item) => (
                    <div key={item.productId} className="flex gap-3 mb-3">
                      <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded bg-stone-100">
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-stone-500">{item.brand} · {item.volume}</p>
                      </div>
                      <p className="text-sm font-medium">{formatCurrency(item.discountPrice)}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Subtotal</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Shipping</span>
                    <span>{selectedOrder.shipping === 0 ? "Free" : formatCurrency(selectedOrder.shipping)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(selectedOrder.total)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Profit</span>
                    <span>{formatCurrency(
                      selectedOrder.items.reduce((s, i) => s + calcProfit(i.discountPrice, i.purchasePrice), 0)
                    )}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-400">Placed: {formatDateTime(selectedOrder.createdAt)}</p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
