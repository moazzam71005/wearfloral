'use client';

import Link from 'next/link';

const categories = [
  {
    name: 'Kurtis',
    image: 'https://images.unsplash.com/photo-1610204388537-b7fbfb7fb523?w=300&h=300&fit=crop',
  },
  {
    name: 'Sarees',
    image: 'https://images.unsplash.com/photo-1629372159122-3e5f4fe0f85d?w=300&h=300&fit=crop',
  },
  {
    name: 'Lehengas',
    image: 'https://images.unsplash.com/photo-1599599810763-e96532a51eca?w=300&h=300&fit=crop',
  },
  {
    name: 'Suits',
    image: 'https://images.unsplash.com/photo-1515602885666-1c0d319dcbf5?w=300&h=300&fit=crop',
  },
];

export function Categories() {
  return (
    <section id="categories" className="py-16 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground">
            Explore our curated collection of traditional and contemporary desi wear
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/shop?category=${category.name}`}
              className="group relative overflow-hidden rounded-lg h-48 md:h-56"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-end">
                <div className="w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <h3 className="font-bold text-white text-lg">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
