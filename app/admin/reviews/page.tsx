"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Plus, Star, Trash2 } from "lucide-react";
import { useData } from "@/context/DataContext";
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

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating ? "fill-amber-400 text-amber-400" : "text-stone-300"
          }`}
        />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const {
    reviews,
    allProducts,
    refreshReviews,
    refreshProducts,
    addReview,
    deleteReview,
  } = useData();
  const fileRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    reviewText: "",
    rating: 5,
    productId: "",
  });

  useEffect(() => {
    refreshProducts();
    refreshReviews().catch(() => undefined);
  }, [refreshProducts, refreshReviews]);

  const soldProducts = useMemo(
    () => allProducts.filter((p) => p.isSold),
    [allProducts]
  );

  const resetForm = () => {
    setForm({ customerName: "", reviewText: "", rating: 5, productId: "" });
    setPhotoFile(null);
    setPreview("");
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.customerName.trim() || !form.reviewText.trim()) {
      setError("Name and review are required");
      return;
    }
    if (form.rating < 1 || form.rating > 5) {
      setError("Rating must be between 1 and 5");
      return;
    }

    setLoading(true);
    try {
      await addReview(
        {
          customerName: form.customerName,
          reviewText: form.reviewText,
          rating: form.rating,
          productId: form.productId || null,
          isPublished: true,
        },
        photoFile
      );
      resetForm();
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-stone-500">
          Add offline / WhatsApp customer feedback. Reviews appear on the homepage after the hero.
        </p>
        <Button
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
          className="gap-2 bg-rose-500 text-white hover:bg-rose-600"
        >
          <Plus className="h-4 w-4" /> Add Review
        </Button>
      </div>

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-200 bg-white py-12 text-center text-sm text-stone-500">
            No reviews yet. Add your first customer review.
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="flex gap-4 rounded-xl border border-stone-200 bg-white p-4"
            >
              {review.photoUrl ? (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                  <Image src={review.photoUrl} alt="" fill className="object-cover" />
                </div>
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-lg font-semibold text-rose-400">
                  {review.customerName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-stone-900">{review.customerName}</p>
                  <Stars rating={review.rating} />
                </div>
                {(review.productName || review.productBrand) && (
                  <p className="mt-0.5 text-xs text-stone-400">
                    {[review.productBrand, review.productName].filter(Boolean).join(" · ")}
                  </p>
                )}
                <p className="mt-2 text-sm leading-relaxed text-stone-600 whitespace-pre-wrap">
                  {review.reviewText}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-red-500"
                onClick={async () => {
                  if (confirm("Delete this review?")) await deleteReview(review.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>

      <Dialog open={open} onOpenChange={(o) => !o && setOpen(false)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add customer review</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Customer name *</Label>
              <Input
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                className="mt-1"
                placeholder="e.g. Ayesha K."
                required
              />
            </div>
            <div>
              <Label>Review *</Label>
              <Textarea
                value={form.reviewText}
                onChange={(e) => setForm({ ...form, reviewText: e.target.value })}
                className="mt-1 min-h-[100px]"
                placeholder="What they said about the fabric / service…"
                required
              />
            </div>
            <div>
              <Label>Rating (out of 5)</Label>
              <div className="mt-2 flex gap-1">
                {Array.from({ length: 5 }, (_, i) => {
                  const value = i + 1;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm({ ...form, rating: value })}
                      className="p-0.5"
                      aria-label={`${value} stars`}
                    >
                      <Star
                        className={`h-7 w-7 ${
                          value <= form.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-stone-300"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <Label>Sold product (optional)</Label>
              <Select
                value={form.productId || "__none__"}
                onValueChange={(v) =>
                  setForm({ ...form, productId: !v || v === "__none__" ? "" : v })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Link to a sold piece" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">No product linked</SelectItem>
                  {soldProducts.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.brand} — {p.productCode} ({p.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Photo (optional)</Label>
              <div className="mt-2 flex items-center gap-3">
                {preview && (
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-stone-100">
                    <Image src={preview} alt="Preview" fill className="object-cover" />
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileRef.current?.click()}
                >
                  {preview ? "Change photo" : "Upload photo"}
                </Button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setPhotoFile(file);
                    setPreview(file ? URL.createObjectURL(file) : "");
                  }}
                />
              </div>
            </div>
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-rose-500 text-white hover:bg-rose-600"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save review
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
