import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

export function CategoryCards() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-900 sm:text-3xl">
            Shop by Category
          </h2>
          <p className="mt-2 text-stone-500">
            Find your perfect outfit across our curated collections
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/shop?category=${encodeURIComponent(category.name)}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-xl"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg font-semibold text-white">
                  {category.name}
                </h3>
                <p className="text-xs text-white/80">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
