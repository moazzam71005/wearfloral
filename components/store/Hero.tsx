import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STORE_TAGLINE } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-stone-50">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
        <div className="flex flex-col justify-center px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <p className="text-sm font-medium uppercase tracking-widest text-rose-400">
            New Collection 2026
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
            Wear Your
            <span className="block text-rose-400">Floral Story</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-stone-600">
            {STORE_TAGLINE}. Discover curated lawn suits, kurtis, and festive
            wear crafted for the modern desi woman.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-rose-400 hover:bg-rose-500 text-white"
              asChild
            >
              <Link href="/shop">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/shop?filter=new">New Arrivals</Link>
            </Button>
          </div>
        </div>
        <div className="relative aspect-[4/5] lg:aspect-auto lg:min-h-[560px]">
          <Image
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=80"
            alt="Wear Floral collection"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:bg-gradient-to-l lg:from-stone-50 lg:via-transparent lg:to-transparent" />
        </div>
      </div>
    </section>
  );
}
