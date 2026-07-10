"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, Plus, Search, Trash2, Tag } from "lucide-react";
import { useData } from "@/context/DataContext";
import { formatCurrency } from "@/lib/format";
import { calcProfit, getOfflineSaleProfit } from "@/lib/types";
import { sortProductsForDisplay } from "@/lib/products";
import type { Product } from "@/lib/types";
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
import { ProductFormModal } from "@/components/admin/ProductFormModal";

export default function AdminProductsPage() {
  const { allProducts, addProduct, updateProduct, deleteProduct, markProductSold, refreshProducts } = useData();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [markingSoldId, setMarkingSoldId] = useState<string | null>(null);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const filtered = sortProductsForDisplay(
    allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.productCode.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => { setEditingProduct(null); setModalOpen(true); }} className="bg-rose-500 hover:bg-rose-600 text-white gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="hidden md:table-cell">Brand</TableHead>
              <TableHead>Sale Price</TableHead>
              <TableHead className="hidden sm:table-cell">Cost</TableHead>
              <TableHead className="hidden lg:table-cell">Profit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-stone-500">
                  No products yet. Add your first fabric piece.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((product) => (
                <TableRow key={product.id} className={product.isSold ? "opacity-60" : ""}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded bg-stone-100">
                        {product.imageUrl ? (
                          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                        ) : (
                          <Image
                            src="/placeholder-product.svg"
                            alt="No photo"
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1">{product.name}</p>
                        <p className="text-xs text-stone-500">{product.productCode}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{product.brand}</TableCell>
                  <TableCell>{formatCurrency(product.discountPrice)}</TableCell>
                  <TableCell className="hidden sm:table-cell text-stone-500">
                    {formatCurrency(product.purchasePrice)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-green-600">
                    {formatCurrency(
                      product.isSold
                        ? getOfflineSaleProfit(product)
                        : calcProfit(product.discountPrice, product.purchasePrice)
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={product.isSold ? "bg-stone-100 text-stone-600" : "bg-green-100 text-green-800"}>
                      {product.isSold ? "Sold" : "Available"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setEditingProduct(product); setModalOpen(true); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {!product.isSold && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                            title="Mark as sold out"
                            disabled={markingSoldId === product.id}
                            onClick={async () => {
                              if (
                                !confirm(
                                  `Mark "${product.name}" as sold out? Revenue will be recorded at ${formatCurrency(product.discountPrice)}.`
                                )
                              ) {
                                return;
                              }
                              setMarkingSoldId(product.id);
                              try {
                                await markProductSold(product.id);
                              } finally {
                                setMarkingSoldId(null);
                              }
                            }}
                          >
                            <Tag className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500"
                            onClick={async () => {
                              if (confirm("Delete this product?")) await deleteProduct(product.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ProductFormModal
        key={editingProduct?.id || "new"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={addProduct}
        onUpdate={updateProduct}
        product={editingProduct}
      />
    </div>
  );
}
