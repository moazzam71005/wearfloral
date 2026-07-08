import Image from "next/image";
import Link from "next/link";

export function PromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl">
        <Image
          src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=1400&q=80"
          alt="Festive collection"
          width={1400}
          height={500}
          className="h-[280px] w-full object-cover object-top sm:h-[360px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-stone-900/50 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="px-8 sm:px-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-rose-300">
              Limited Edition
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-white sm:text-4xl">
              Wedding Season<br />Festive Wear
            </h2>
            <p className="mt-3 max-w-xs text-sm text-stone-300">
              Handcrafted organza & jacquard suits for your most memorable occasions.
            </p>
            <Link
              href="/shop?category=Shalwar+Kameez"
              className="mt-6 inline-flex items-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-rose-50"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
