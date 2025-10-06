'use client';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

interface ProductCardProps {
  product: Product | null;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  if (!product) {
    return (
      <div className="w-full">
        <Skeleton className="aspect-square w-full rounded-xl" />
        <div className="mt-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <Card
      className={cn(
        'group w-full max-w-sm overflow-hidden transition-all duration-300 ease-in-out border-none shadow-none bg-transparent animate-in fade-in-0 zoom-in-95'
      )}
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
    >
      <CardContent className="p-0">
        <div className="aspect-square relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint="product image"
          />
        </div>
        <div className="pt-4 text-left">
          <h3 className="font-headline text-lg font-medium text-foreground">{product.name}</h3>
          <p className="text-md text-primary font-semibold">${product.price.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
