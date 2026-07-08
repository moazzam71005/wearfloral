"use client";

import { useState } from "react";
import { AlertTriangle, Plus } from "lucide-react";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function AdminInventoryPage() {
  const { inventory, addStock } = useData();
  const [search, setSearch] = useState("");
  const [addStockItem, setAddStockItem] = useState<string | null>(null);
  const [addAmount, setAddAmount] = useState(10);

  const filtered = inventory.filter(
    (item) =>
      item.productName.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockCount = inventory.filter(
    (i) => i.stock <= i.lowStockThreshold
  ).length;

  const handleAddStock = () => {
    if (addStockItem && addAmount > 0) {
      addStock(addStockItem, addAmount);
      setAddStockItem(null);
      setAddAmount(10);
    }
  };

  return (
    <div className="space-y-6">
      {lowStockCount > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>{lowStockCount}</strong> inventory items are at or below low
            stock threshold.
          </p>
        </div>
      )}

      <div className="relative max-w-sm">
        <Input
          placeholder="Search by product or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="hidden sm:table-cell">SKU</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="hidden md:table-cell">Threshold</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => {
              const isLow = item.stock <= item.lowStockThreshold;
              return (
                <TableRow
                  key={item.id}
                  className={isLow ? "bg-red-50/50" : ""}
                >
                  <TableCell className="font-medium">
                    {item.productName}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-stone-500 text-sm">
                    {item.sku}
                  </TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        isLow ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                      }
                    >
                      {item.stock}
                      {isLow && " (Low)"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-stone-500">
                    {item.lowStockThreshold}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => setAddStockItem(item.id)}
                    >
                      <Plus className="h-3 w-3" />
                      Add Stock
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!addStockItem}
        onOpenChange={(open) => !open && setAddStockItem(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Stock</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Quantity to add</Label>
              <Input
                type="number"
                min={1}
                value={addAmount}
                onChange={(e) => setAddAmount(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setAddStockItem(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddStock}
                className="bg-rose-400 hover:bg-rose-500 text-white"
              >
                Add Stock
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


