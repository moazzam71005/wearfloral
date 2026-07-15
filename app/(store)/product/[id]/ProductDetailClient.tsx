"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";
import { ShoppingBag, Truck, Loader2, Star } from "lucide-react";
import { useData } from "@/context/DataContext";
import { useCart } from "@/context/CartContext";
import { getRelatedProducts } from "@/lib/filters";
import { formatCurrency } from "@/lib/format";
import { calcDiscountPercent, getStorefrontPrice } from "@/lib/types";
import { FREE_SHIPPING_MESSAGE } from "@/lib/constants";
import { ProductCard } from "@/components/store/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProductDetailClient({
  params,
}: {
  params: { id: string };
}) {
  const { products, allProducts, reviews, isLoading } = useData();
  const { addItem, hasItem } = useCart();
  const product = allProducts.find((p) => p.id === params.id);
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-400" />
      </div>
    );
  }

  if (!product) notFound();

  const discount = calcDiscountPercent(product.displayPrice, product.discountPrice);
  const related = getRelatedProducts(products, product);
  const inCart = hasItem(product.id);
  const soldOut = product.isSold;
  const storefrontPrice = getStorefrontPrice(product);
  const productReviews = reviews.filter(
    (r) => r.isPublished && r.productId === product.id
  );

  const handleAddToCart = () => {
    if (soldOut || inCart) return;
    addItem({
      productId: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      discountPrice: product.discountPrice,
      displayPrice: product.displayPrice,
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-stone-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-rose-500">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-rose-500">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-stone-900">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-stone-100">
            <Image
              src={product.imageUrls[selectedImage] || product.imageUrl || "/placeholder-product.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {discount > 0 && !soldOut && (
              <Badge className="absolute left-4 top-4 bg-rose-500 text-white">
                -{discount}%
              </Badge>
            )}
            {soldOut && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="rounded-full bg-white px-6 py-2 text-lg font-bold text-stone-900">
                  Sold Out
                </span>
              </div>
            )}
          </div>
          {product.imageUrls.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {product.imageUrls.map((img, index) => (
                <button
                  key={`${img}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-16 w-14 shrink-0 overflow-hidden rounded-md border-2 ${
                    selectedImage === index ? "border-rose-500" : "border-stone-200"
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image src={img} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm uppercase tracking-wider text-stone-500">{product.brand}</p>
          <h1 className="mt-2 text-2xl font-bold text-stone-900 sm:text-3xl">{product.name}</h1>
          <p className="mt-1 text-sm text-stone-500">ID: {product.productCode}</p>
          <p className="mt-1 text-sm font-medium text-stone-700">{product.volume}</p>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-bold text-stone-900">
              {formatCurrency(storefrontPrice)}
            </span>
            {!soldOut && discount > 0 && (
              <span className="text-lg text-stone-400 line-through">
                {formatCurrency(product.displayPrice)}
              </span>
            )}
          </div>

          {product.description.trim() && (
            <div className="mt-6 rounded-xl border border-stone-100 bg-stone-50/80 p-4 sm:p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                Description
              </h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-stone-700">
                {product.description}
              </p>
            </div>
          )}

          <div className="mt-8">
            <Button
              size="lg"
              className="w-full gap-2 bg-rose-500 text-white hover:bg-rose-600 sm:w-auto"
              onClick={handleAddToCart}
              disabled={soldOut || inCart}
            >
              <ShoppingBag className="h-5 w-5" />
              {soldOut ? "Sold Out" : inCart ? "In Cart" : "Add to Cart"}
            </Button>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-lg bg-stone-50 p-4 text-sm text-stone-600">
            <Truck className="h-5 w-5 text-rose-400" />
            {FREE_SHIPPING_MESSAGE}
          </div>
        </div>
      </div>

      {productReviews.length > 0 && (
        <section className="mt-16 border-t border-stone-100 pt-12">
          <h2 className="text-2xl font-bold text-stone-900">Customer reviews</h2>
          <p className="mt-1 text-sm text-stone-500">
            Feedback from buyers of this piece
          </p>
          <div className="mt-8 space-y-6">
            {productReviews.map((review) => (
              <article
                key={review.id}
                className="flex gap-4 rounded-2xl border border-stone-100 bg-stone-50/80 p-4 sm:p-5"
              >
                {review.photoUrl ? (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-stone-200">
                    <Image
                      src={review.photoUrl}
                      alt={review.customerName}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-rose-100 text-lg font-semibold text-rose-500">
                    {review.customerName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-stone-900">{review.customerName}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-stone-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-stone-600">
                    {review.reviewText}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-stone-900">More from {product.brand}</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
