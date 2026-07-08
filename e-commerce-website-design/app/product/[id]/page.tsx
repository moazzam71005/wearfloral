'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { mockProducts } from '@/lib/mock-data';
import { useCartStore } from '@/lib/cart-store';
import { useAuthStore } from '@/lib/auth-store';
import { Star, Heart, ShoppingCart, Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const product = mockProducts.find((p) => p.id === productId);

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { user } = useAuthStore();
  const router = useRouter();

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product not found</h1>
          <Link href="/shop" className="text-primary hover:underline">
            Back to shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (user?.role !== 'user') {
      router.push('/login');
      return;
    }
    addItem(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (user?.role !== 'user') {
      router.push('/login');
      return;
    }
    addItem(product, quantity);
    router.push('/cart');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-primary">
            Shop
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden bg-secondary">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold text-sm">
                  -{discount}%
                </div>
              )}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 left-4 h-10 w-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition"
              >
                <Heart
                  size={20}
                  className={isWishlisted ? 'fill-primary text-primary' : 'text-foreground'}
                />
              </button>
            </div>

            {/* Image Thumbnails */}
            <div className="flex gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`h-20 w-20 rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === index ? 'border-primary' : 'border-border'
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                {product.category}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < Math.floor(product.rating) ? 'fill-current' : ''}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <p className="text-3xl font-bold text-foreground">
                  PKR {product.price.toLocaleString()}
                </p>
                {product.originalPrice && (
                  <p className="text-lg text-muted-foreground line-through">
                    PKR {product.originalPrice.toLocaleString()}
                  </p>
                )}
              </div>
              {discount > 0 && (
                <p className="text-sm text-green-600 font-semibold">
                  Save PKR {(product.originalPrice! - product.price).toLocaleString()}
                </p>
              )}
            </div>

            {/* Description */}
            <p className="text-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <Check size={20} className="text-green-600" />
                  <p className="text-sm text-green-600 font-semibold">
                    In Stock ({product.stock} available)
                  </p>
                </>
              ) : (
                <>
                  <AlertCircle size={20} className="text-red-600" />
                  <p className="text-sm text-red-600 font-semibold">Out of Stock</p>
                </>
              )}
            </div>

            {/* Size/Quantity Selection */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 rounded border border-border hover:bg-secondary transition flex items-center justify-center text-foreground"
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold text-foreground w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="h-10 w-10 rounded border border-border hover:bg-secondary transition flex items-center justify-center text-foreground"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                  addedToCart
                    ? 'bg-green-600 text-white'
                    : 'bg-secondary text-foreground hover:bg-muted'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {addedToCart ? (
                  <>
                    <Check size={20} />
                    Added!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 py-3 rounded-lg font-semibold bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            {/* Additional Info */}
            <div className="border-t border-border pt-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Material:</span>
                <span className="text-foreground font-semibold">Premium Blend</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping:</span>
                <span className="text-foreground font-semibold">2-3 business days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Returns:</span>
                <span className="text-foreground font-semibold">30 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16 pt-12 border-t border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockProducts
              .filter((p) => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="group rounded-lg border border-border overflow-hidden hover:shadow-lg transition"
                >
                  <div className="relative h-48 bg-secondary overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
                      {p.name}
                    </h3>
                    <p className="text-lg font-bold text-foreground">
                      PKR {p.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
