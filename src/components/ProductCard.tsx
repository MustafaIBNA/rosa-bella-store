'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  return (
    <Card
      className={cn(
        'group w-full max-w-sm overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 animate-in fade-in-0 zoom-in-95',
      )}
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
    >
      <CardHeader className="p-0">
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint="product image"
          />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <CardTitle className="font-headline text-2xl mb-2">{product.name}</CardTitle>
        <p className="text-muted-foreground text-sm line-clamp-3">{product.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-6 pt-0">
        <p className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>
        <Button>
          <ShoppingCart className="mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
