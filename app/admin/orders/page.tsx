"use client";

import { useState } from "react";
import Image from "next/image";
import { useData } from "@/context/DataContext";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useData();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered =
    statusFilter === "All"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  const sorted = [...filtered].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            size="sm"
            className={
              statusFilter === status
                ? "bg-rose-400 hover:bg-rose-500 text-white"
                : ""
            }
            onClick={() => setStatusFilter(status)}
          >
            {status}
            {status !== "All" && (
              <Badge variant="secondary" className="ml-2 bg-white/20">
                {orders.filter((o) => o.status === status).length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      <OrdersTable orders={sorted} onSelect={setSelectedOrder} />

      <Sheet
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      >
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selectedOrder && (
            <>
              <SheetHeader>
                <SheetTitle>Order {selectedOrder.id}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm font-medium text-stone-500">Status</p>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(v) => {
                      if (!v) return;
                      updateOrderStatus(selectedOrder.id, v as OrderStatus);
                      setSelectedOrder({
                        ...selectedOrder,
                        status: v as OrderStatus,
                      });
                    }}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses
                        .filter((s) => s !== "All")
                        .map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <p className="text-sm font-medium text-stone-500">Customer</p>
                  <p className="mt-1">{selectedOrder.customerName}</p>
                  <p className="text-sm text-stone-500">
                    {selectedOrder.customerEmail}
                  </p>
                  <p className="text-sm text-stone-500">
                    {selectedOrder.customerPhone}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-stone-500">Shipping</p>
                  <p className="mt-1 text-sm">
                    {selectedOrder.shippingAddress}
                  </p>
                  <p className="text-sm">{selectedOrder.city}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-stone-500 mb-3">
                    Items
                  </p>
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex gap-3 mb-3">
                      <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded bg-stone-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-stone-500">
                          {item.size} / {item.color} x{item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
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
                    <span>
                      {selectedOrder.shipping === 0
                        ? "Free"
                        : formatCurrency(selectedOrder.shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-400">
                  Placed: {formatDateTime(selectedOrder.createdAt)}
                </p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}


