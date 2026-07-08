"use client";

import { useState } from "react";
import type { Category, Product } from "@/lib/types";
import { BRANDS, CATEGORIES, COLORS, SIZES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, "id" | "createdAt">) => void;
  onUpdate?: (id: string, updates: Partial<Product>) => void;
  product?: Product | null;
}

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  material: "",
  care: "",
  shipping: "Ships within 2-3 business days.",
  category: "Lawn" as Category,
  brand: "Wear Floral",
  price: 0,
  compareAtPrice: 0,
  images: [""],
  colors: ["White"] as string[],
  sizes: ["S", "M", "L"] as string[],
  stock: 10,
  lowStockThreshold: 5,
  sku: "",
  isNewArrival: false,
  isBestSeller: false,
  rating: 4.5,
  reviewCount: 0,
};

export function ProductFormModal({
  open,
  onClose,
  onSave,
  onUpdate,
  product,
}: ProductFormModalProps) {
  const [form, setForm] = useState(() =>
    product
      ? {
          name: product.name,
          slug: product.slug,
          description: product.description,
          material: product.material,
          care: product.care,
          shipping: product.shipping,
          category: product.category,
          brand: product.brand,
          price: product.price,
          compareAtPrice: product.compareAtPrice || 0,
          images: product.images,
          colors: product.colors,
          sizes: product.sizes,
          stock: product.stock,
          lowStockThreshold: product.lowStockThreshold,
          sku: product.sku,
          isNewArrival: product.isNewArrival,
          isBestSeller: product.isBestSeller,
          rating: product.rating,
          reviewCount: product.reviewCount,
        }
      : emptyForm
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...form,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
      compareAtPrice: form.compareAtPrice || undefined,
      images: form.images.filter(Boolean),
    };
    if (product && onUpdate) {
      onUpdate(product.id, data);
    } else {
      onSave(data);
    }
    onClose();
  };

  const toggleSize = (size: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const toggleColor = (color: string) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Price (PKR)</Label>
              <Input
                type="number"
                required
                min={0}
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label>Compare Price</Label>
              <Input
                type="number"
                min={0}
                value={form.compareAtPrice}
                onChange={(e) =>
                  setForm({
                    ...form,
                    compareAtPrice: Number(e.target.value),
                  })
                }
                className="mt-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  v && setForm({ ...form, category: v as Category })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.name} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Brand</Label>
              <Select
                value={form.brand}
                onValueChange={(v) => v && setForm({ ...form, brand: v })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BRANDS.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label>Image URL</Label>
            <Input
              value={form.images[0]}
              onChange={(e) =>
                setForm({ ...form, images: [e.target.value] })
              }
              placeholder="https://..."
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Stock</Label>
              <Input
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form, stock: Number(e.target.value) })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label>SKU</Label>
              <Input
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label className="mb-2 block">Sizes</Label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => (
                <Button
                  key={size}
                  type="button"
                  variant={form.sizes.includes(size) ? "default" : "outline"}
                  size="sm"
                  className={
                    form.sizes.includes(size)
                      ? "bg-rose-400 hover:bg-rose-500 text-white"
                      : ""
                  }
                  onClick={() => toggleSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label className="mb-2 block">Colors</Label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <Button
                  key={color}
                  type="button"
                  variant={
                    form.colors.includes(color) ? "default" : "outline"
                  }
                  size="sm"
                  className={
                    form.colors.includes(color)
                      ? "bg-rose-400 hover:bg-rose-500 text-white"
                      : ""
                  }
                  onClick={() => toggleColor(color)}
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="newArrival"
                checked={form.isNewArrival}
                onCheckedChange={(c) =>
                  setForm({ ...form, isNewArrival: !!c })
                }
              />
              <Label htmlFor="newArrival">New Arrival</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="bestSeller"
                checked={form.isBestSeller}
                onCheckedChange={(c) =>
                  setForm({ ...form, isBestSeller: !!c })
                }
              />
              <Label htmlFor="bestSeller">Best Seller</Label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-rose-400 hover:bg-rose-500 text-white"
            >
              {product ? "Update" : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
