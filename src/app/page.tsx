'use client';
import { useContext, useMemo, useState } from 'react';
import { ProductContext } from '@/context/ProductContext';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { HeroSlider } from '@/components/HeroSlider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { products, isLoading } = useContext(ProductContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    if (isLoading || !products) {
      return { allCategories: [], categorizedProducts: {} };
    }
    const allCategories = [...new Set(products.map(p => p.category).filter(Boolean))].sort();
    const categorizedProducts = products.reduce((acc, product) => {
      if (!product.category) return acc;
      const category = product.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {} as Record<string, Product[]>);

    return { allCategories, categorizedProducts };
  }, [products, isLoading]);

  const filteredProducts = useMemo(() => {
    let prods = products || [];

    if (selectedCategory) {
      prods = prods.filter(p => p.category === selectedCategory);
    }

    if (searchTerm) {
      prods = prods.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return prods;
  }, [products, searchTerm, selectedCategory]);

  const displayedProducts = selectedCategory ? filteredProducts : products;

  const productsByCategory = useMemo(() => {
    if (selectedCategory) {
      return { [selectedCategory]: filteredProducts };
    }
    return filteredProducts.reduce((acc, product) => {
      if (!product.category) return acc;
      const category = product.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
  }, [filteredProducts, selectedCategory]);


  return (
    <main className="flex-1">
      <HeroSlider />
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

          <div className="mb-12 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder="Search by product or category..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedCategory(null); // Reset category when searching
                }}
                className="w-full sm:max-w-xs"
              />
              <div className="flex gap-2 flex-wrap items-center">
                 <Button
                    variant={!selectedCategory ? 'default' : 'outline'}
                    onClick={() => {
                        setSelectedCategory(null);
                        setSearchTerm('');
                    }}
                  >
                    All
                  </Button>
                {categories.allCategories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    onClick={() => {
                        setSelectedCategory(category);
                        setSearchTerm('');
                    }}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-16">
            {isLoading ? (
               Array.from({ length: 2 }).map((_, i) => (
                <div key={`category-skeleton-${i}`}>
                   <Skeleton className="h-10 w-48 mb-8" />
                   <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
                     {Array.from({ length: 4 }).map((_, j) => (
                       <ProductCard key={`product-skeleton-${j}`} product={null} index={j} />
                     ))}
                   </div>
                 </div>
               ))
            ) : Object.keys(productsByCategory).length > 0 ? (
                Object.keys(productsByCategory).sort().map(categoryName => (
                  <div key={categoryName}>
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl font-headline text-left mb-8 underline underline-offset-8">
                      {categoryName}
                    </h2>
                    <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
                      {productsByCategory[categoryName].map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                      ))}
                    </div>
                  </div>
                ))
            ) : (
                 <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
                 </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
