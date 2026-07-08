import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { Categories } from '@/components/categories';
import { ProductCard } from '@/components/product-card';
import { Footer } from '@/components/footer';
import { mockProducts } from '@/lib/mock-data';

export default function Home() {
  const featuredProducts = mockProducts.slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Categories />

      {/* Featured Products */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Collection
            </h2>
            <p className="text-muted-foreground">
              Curated bestsellers and new arrivals from our collection
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
