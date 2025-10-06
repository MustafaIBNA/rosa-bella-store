'use client';
import { useContext, useMemo } from 'react';
import { ProductContext } from '@/context/ProductContext';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { products, isLoading } = useContext(ProductContext);

  const categories = useMemo(() => {
    if (isLoading || !products) {
      return {};
    }
    return products.reduce((acc, product) => {
      if (!product.category) return acc;
      const category = product.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
  }, [products, isLoading]);

  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none font-headline">
              Our Artisan Collection
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Discover our handcrafted candles and coasters, made with love and care.
            </p>
          </div>
          
          <div className="space-y-16">
            {isLoading ? (
               Array.from({ length: 2 }).map((_, i) => (
                <div key={`category-skeleton-${i}`}>
                   <Skeleton className="h-10 w-48 mb-8" />
                   <div className="mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
                     {Array.from({ length: 4 }).map((_, j) => (
                       <ProductCard key={`product-skeleton-${j}`} product={null} index={j} />
                     ))}
                   </div>
                 </div>
               ))
            ) : (Object.keys(categories) as (keyof typeof categories)[]).sort().map(categoryName => (
              <div key={categoryName}>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl font-headline text-left mb-8">
                  {categoryName}s
                </h2>
                <div className="mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
                  {categories[categoryName].map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
