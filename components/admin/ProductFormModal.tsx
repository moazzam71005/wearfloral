"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { calcDiscountPercent } from "@/lib/types";
import { BRANDS } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  onSave: (data: {
    productCode: string;
    name: string;
    brand: string;
    volume: string;
    description: string;
    displayPrice: number;
    discountPrice: number;
    purchasePrice: number;
    imagePath: string;
  }, imageFile: File) => Promise<void>;
  onUpdate?: (
    id: string,
    data: Partial<{
      productCode: string;
      name: string;
      brand: string;
      volume: string;
      description: string;
      displayPrice: number;
      discountPrice: number;
      purchasePrice: number;
      imagePath: string;
    }>,
    imageFile?: File
  ) => Promise<void>;
  product?: Product | null;
}

export function ProductFormModal({
  open,
  onClose,
  onSave,
  onUpdate,
  product,
}: ProductFormModalProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(product?.imageUrl ?? null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    productCode: product?.productCode ?? "",
    name: product?.name ?? "",
    brand: product?.brand ?? BRANDS[0],
    volume: product?.volume ?? "",
    description: product?.description ?? "",
    displayPrice: product?.displayPrice ?? 0,
    discountPrice: product?.discountPrice ?? 0,
    purchasePrice: product?.purchasePrice ?? 0,
  });

  const discount = calcDiscountPercent(form.displayPrice, form.discountPrice);
  const profit = form.discountPrice - form.purchasePrice;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!product && !imageFile) {
      setError("Please upload a product photo");
      return;
    }
    if (!form.productCode.trim()) {
      setError("Product ID is required");
      return;
    }
    if (form.discountPrice > form.displayPrice) {
      setError("Discount price cannot exceed display price");
      return;
    }

    setLoading(true);
    try {
      const data = {
        ...form,
        name: form.name || `${form.brand} - ${form.productCode}`,
        imagePath: product?.imagePath ?? "",
      };

      if (product && onUpdate) {
        await onUpdate(product.id, data, imageFile ?? undefined);
      } else if (imageFile) {
        await onSave(data, imageFile);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Product Photo *</Label>
            <div className="mt-2 flex items-center gap-4">
              {preview && (
                <div className="relative h-24 w-20 overflow-hidden rounded-lg bg-stone-100">
                  <Image src={preview} alt="Preview" fill className="object-cover" />
                </div>
              )}
              <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
                {preview ? "Change Photo" : "Upload Photo"}
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div>
            <Label>Product ID *</Label>
            <Input
              required
              value={form.productCode}
              onChange={(e) => setForm({ ...form, productCode: e.target.value })}
              placeholder="e.g. WF-001"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Brand *</Label>
              <Select value={form.brand} onValueChange={(v) => v && setForm({ ...form, brand: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {BRANDS.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Volume</Label>
              <Input
                value={form.volume}
                onChange={(e) => setForm({ ...form, volume: e.target.value })}
                placeholder="3-Piece Unstitched"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Auto-generated if empty"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Display Price</Label>
              <Input
                type="number"
                required
                min={0}
                value={form.displayPrice || ""}
                onChange={(e) => setForm({ ...form, displayPrice: Number(e.target.value) })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Discount Price</Label>
              <Input
                type="number"
                required
                min={0}
                value={form.discountPrice || ""}
                onChange={(e) => setForm({ ...form, discountPrice: Number(e.target.value) })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Cost Price</Label>
              <Input
                type="number"
                required
                min={0}
                value={form.purchasePrice || ""}
                onChange={(e) => setForm({ ...form, purchasePrice: Number(e.target.value) })}
                className="mt-1"
              />
            </div>
          </div>

          {form.displayPrice > 0 && (
            <div className="rounded-lg bg-stone-50 p-3 text-sm">
              <p>Discount: <strong>{discount}%</strong></p>
              <p>Profit per sale: <strong className="text-green-600">{formatCurrency(profit)}</strong></p>
            </div>
          )}

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-rose-500 hover:bg-rose-600 text-white">
              {loading ? "Saving…" : product ? "Update" : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
