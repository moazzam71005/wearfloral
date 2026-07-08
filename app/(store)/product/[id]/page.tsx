"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";
import {
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import { useData } from "@/context/DataContext";
import { useCart } from "@/context/CartContext";
import { getRelatedProducts } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";
import { ProductCard } from "@/components/store/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { products } = useData();
  const { addItem } = useCart();
  const product = products.find((p) => p.id === params.id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(products, product);
  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100
      )
    : 0;

  const handleAddToCart = () => {
    const size = selectedSize || product.sizes[0];
    const color = selectedColor || product.colors[0];
    addItem({
      productId: product.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      size,
      color,
      quantity,
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-stone-500">
        <Link href="/" className="hover:text-rose-500">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-rose-500">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-stone-900">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-stone-100">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {discount > 0 && (
              <Badge className="absolute left-4 top-4 bg-rose-400 text-white">
                -{discount}%
              </Badge>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setSelectedImage(i)}
                  className={`relative h-20 w-16 overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImage === i
                      ? "border-rose-400"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm uppercase tracking-wider text-stone-500">
            {product.brand}
          </p>
          <h1 className="mt-2 text-2xl font-bold text-stone-900 sm:text-3xl">
            {product.name}
          </h1>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium">{product.rating}</span>
            </div>
            <span className="text-sm text-stone-400">
              ({product.reviewCount} reviews)
            </span>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-bold text-stone-900">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-lg text-stone-400 line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-stone-500">
            {product.stock > 0 ? (
              <span className="text-green-600">
                {product.stock} in stock
              </span>
            ) : (
              <span className="text-red-500">Out of stock</span>
            )}
          </p>

          <div className="mt-6">
            <p className="mb-2 text-sm font-medium">Color</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <Button
                  key={color}
                  variant={selectedColor === color ? "default" : "outline"}
                  size="sm"
                  className={
                    selectedColor === color
                      ? "bg-rose-400 hover:bg-rose-500 text-white"
                      : ""
                  }
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  size="sm"
                  className={
                    selectedSize === size
                      ? "bg-rose-400 hover:bg-rose-500 text-white"
                      : ""
                  }
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium">Quantity</p>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="flex-1 bg-rose-400 hover:bg-rose-500 text-white gap-2"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingBag className="h-5 w-5" />
              Add to Cart
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Heart className="h-5 w-5" />
              Wishlist
            </Button>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-lg bg-stone-50 p-4 text-sm text-stone-600">
            <Truck className="h-5 w-5 text-rose-400" />
            Free shipping on orders over PKR 5,000
          </div>

          <div className="mt-8 divide-y divide-stone-200 border-t border-stone-200">
            <details className="group py-4" open>
              <summary className="cursor-pointer list-none font-medium text-stone-900 marker:content-none">
                Description
              </summary>
              <p className="mt-3 text-sm text-stone-600">{product.description}</p>
            </details>
            <details className="group py-4">
              <summary className="cursor-pointer list-none font-medium text-stone-900 marker:content-none">
                Material & Care
              </summary>
              <div className="mt-3 text-sm text-stone-600">
                <p className="font-medium">{product.material}</p>
                <p className="mt-2">{product.care}</p>
              </div>
            </details>
            <details className="group py-4">
              <summary className="cursor-pointer list-none font-medium text-stone-900 marker:content-none">
                Shipping
              </summary>
              <p className="mt-3 text-sm text-stone-600">{product.shipping}</p>
            </details>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-stone-900">You May Also Like</h2>
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
