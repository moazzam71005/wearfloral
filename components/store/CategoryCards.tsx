import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

export function CategoryCards() {
  return (
    <section className="py-16 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-rose-500">
              Collections
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-stone-900 sm:text-4xl">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden text-sm font-medium text-stone-500 underline-offset-4 hover:text-rose-500 hover:underline sm:block"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {CATEGORIES.map((category, idx) => (
            <Link
              key={category.slug}
              href={`/shop?category=${encodeURIComponent(category.name)}`}
              className={`group relative overflow-hidden rounded-2xl ${
                idx === 0 ? "col-span-2 lg:col-span-2" : ""
              }`}
            >
              <div
                className={`relative w-full overflow-hidden ${
                  idx === 0 ? "aspect-[16/9] lg:aspect-[4/3]" : "aspect-[3/4]"
                }`}
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes={
                    idx === 0
                      ? "(max-width: 1024px) 100vw, 40vw"
                      : "(max-width: 640px) 50vw, 15vw"
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-bold text-white">{category.name}</h3>
                  <p className="mt-0.5 text-xs text-white/70">{category.description}</p>
                </div>
                <div className="absolute right-3 top-3 translate-x-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-900 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                  Shop →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
