'use client';
import { useContext, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { ProductContext } from '@/context/ProductContext';
import { CartContext } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ProductCard } from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart } from 'lucide-react';

export default function ProductPage() {
  const { id } = useParams();
  const { products, isLoading: productsLoading } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const { toast } = useToast();

  const product = useMemo(() => {
    if (!products) return null;
    return products.find(p => p.id === id);
  }, [products, id]);

  const suggestedProducts = useMemo(() => {
    if (!product || !products) return [];
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product, products]);

  if (productsLoading) {
    return (
      <main className="flex-1 container mx-auto px-4 md:px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p>Product not found.</p>
      </main>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `"${product.name}" has been added to your cart.`,
    });
  };

  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
            <div className="aspect-square relative w-full overflow-hidden rounded-lg">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold font-headline">{product.name}</h1>
                <p className="text-2xl font-semibold text-primary mt-2">EGP {product.price.toFixed(2)}</p>
              </div>
              <p className="text-muted-foreground text-lg">{product.description}</p>
              <Button size="lg" onClick={handleAddToCart}>
                 <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </section>

      {suggestedProducts.length > 0 && (
        <section className="w-full py-12 md:py-24 bg-muted/40">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-bold font-headline mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 justify-items-center">
              {suggestedProducts.map((p, index) => (
                <ProductCard key={p.id} product={p} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
