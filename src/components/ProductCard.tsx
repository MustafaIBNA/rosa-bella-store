'use client';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { useContext } from 'react';
import { CartContext } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product | null;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const { addToCart } = useContext(CartContext);
  const { toast } = useToast();

  if (!product) {
    return (
      <div className="w-full">
        <Skeleton className="aspect-square w-full rounded-md" />
        <div className="mt-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `"${product.name}" has been added to your cart.`,
    })
  };


  return (
    <Card
      className={cn(
        'group w-full max-w-sm overflow-hidden rounded-lg border-none shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-2 bg-card'
      )}
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
    >
      <CardContent className="p-3">
        <div className="aspect-square relative overflow-hidden rounded-sm">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 ease-in-out"
            style={{ borderRadius: '4px' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="pt-3 text-left">
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-base text-foreground pr-2">{product.name}</h3>
            <p className="text-md font-semibold text-primary whitespace-nowrap">${product.price.toFixed(2)}</p>
          </div>
          <p className="text-sm text-muted-foreground mt-1 h-10 overflow-hidden group-hover:h-auto transition-all duration-300 ease-in-out">
            {product.description}
          </p>
           <Button onClick={handleAddToCart} className="w-full mt-4">
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
