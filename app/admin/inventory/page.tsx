"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import { Package } from "lucide-react";
import { useData } from "@/context/DataContext";
import { formatCurrency } from "@/lib/format";
import { calcProfit } from "@/lib/types";
import { StatsCard } from "@/components/admin/StatsCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminInventoryPage() {
  const { products, refreshProducts } = useData();

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const available = products.filter((p) => !p.isSold);

  const summary = useMemo(() => {
    const totalValue = available.reduce((s, p) => s + p.discountPrice, 0);
    const totalCost = available.reduce((s, p) => s + p.purchasePrice, 0);
    return { count: available.length, totalValue, totalCost, potentialProfit: totalValue - totalCost };
  }, [available]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Available Pieces" value={String(summary.count)} icon={Package} />
        <StatsCard title="Inventory Value" value={formatCurrency(summary.totalValue)} icon={Package} />
        <StatsCard title="Total Cost" value={formatCurrency(summary.totalCost)} icon={Package} />
        <StatsCard title="Potential Profit" value={formatCurrency(summary.potentialProfit)} icon={Package} trendUp />
      </div>

      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead>Sale Price</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Profit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {available.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-stone-500">
                  No available pieces in stock
                </TableCell>
              </TableRow>
            ) : (
              available.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-8 overflow-hidden rounded bg-stone-100">
                        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-stone-500">{product.productCode}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell className="text-sm text-stone-500">{product.volume}</TableCell>
                  <TableCell>{formatCurrency(product.discountPrice)}</TableCell>
                  <TableCell className="text-stone-500">{formatCurrency(product.purchasePrice)}</TableCell>
                  <TableCell className="text-green-600">
                    {formatCurrency(calcProfit(product.discountPrice, product.purchasePrice))}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
