"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Review } from "@/lib/types";

interface ReviewsCarouselProps {
  reviews: Review[];
}

export function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  const published = reviews.filter((r) => r.isPublished);
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (published.length <= 1) return;
    const id = window.setInterval(() => {
      setFade(false);
      window.setTimeout(() => {
        setIndex((prev) => (prev + 1) % published.length);
        setFade(true);
      }, 280);
    }, 5200);
    return () => window.clearInterval(id);
  }, [published.length]);

  if (published.length === 0) return null;

  const review = published[index] ?? published[0];
  const productHref = review.productId ? `/product/${review.productId}` : null;

  const body = (
    <>
      <div className="mb-4 flex justify-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < review.rating
                ? "fill-amber-400 text-amber-400"
                : "text-stone-300"
            }`}
          />
        ))}
      </div>
      <blockquote className="font-heading text-xl leading-relaxed text-stone-800 sm:text-2xl">
        “{review.reviewText}”
      </blockquote>
      <div className="mt-6 flex items-center justify-center gap-3">
        {review.photoUrl ? (
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-stone-200">
            <Image
              src={review.photoUrl}
              alt={review.customerName}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-sm font-semibold text-rose-500">
            {review.customerName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="text-left">
          <p className="text-sm font-medium text-stone-900">{review.customerName}</p>
          {(review.productBrand || review.productName) && (
            <p className="text-xs text-stone-400">
              {[review.productBrand, review.productName].filter(Boolean).join(" · ")}
              {productHref ? " · View product" : ""}
            </p>
          )}
        </div>
      </div>
    </>
  );

  return (
    <section className="border-y border-stone-100 bg-stone-50/60 py-12 sm:py-14">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-400">
          Customer Reviews
        </p>
        <div
          className={`mt-6 transition-opacity duration-300 ease-out ${
            fade ? "opacity-100" : "opacity-0"
          }`}
          key={review.id}
        >
          {productHref ? (
            <Link
              href={productHref}
              className="block rounded-2xl outline-none transition-colors hover:opacity-90 focus-visible:ring-2 focus-visible:ring-rose-300"
            >
              {body}
            </Link>
          ) : (
            body
          )}
        </div>
        {published.length > 1 && (
          <div className="mt-8 flex justify-center gap-1.5">
            {published.map((r, i) => (
              <button
                key={r.id}
                type="button"
                aria-label={`Show review ${i + 1}`}
                onClick={() => {
                  setFade(false);
                  window.setTimeout(() => {
                    setIndex(i);
                    setFade(true);
                  }, 200);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-rose-400" : "w-1.5 bg-stone-300 hover:bg-stone-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
