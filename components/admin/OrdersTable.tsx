"use client";

import { formatCurrency, formatDateTime } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusColors: Record<OrderStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

interface OrdersTableProps {
  orders: Order[];
  onSelect?: (order: Order) => void;
  compact?: boolean;
}

export function OrdersTable({ orders, onSelect, compact }: OrdersTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-stone-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            {!compact && <TableHead className="hidden md:table-cell">City</TableHead>}
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            {!compact && <TableHead className="hidden sm:table-cell">Date</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={compact ? 4 : 6} className="text-center py-8 text-stone-500">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow
                key={order.id}
                className={onSelect ? "cursor-pointer hover:bg-stone-50" : ""}
                onClick={() => onSelect?.(order)}
              >
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                {!compact && (
                  <TableCell className="hidden md:table-cell">
                    {order.city}
                  </TableCell>
                )}
                <TableCell>{formatCurrency(order.total)}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={statusColors[order.status]}
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                {!compact && (
                  <TableCell className="hidden sm:table-cell text-stone-500 text-sm">
                    {formatDateTime(order.createdAt)}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
