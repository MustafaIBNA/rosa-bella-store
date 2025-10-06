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
        <Skeleton className="aspect-square w-full rounded-md" />
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
        'group w-full max-w-sm overflow-hidden rounded-2xl border-none shadow-md hover:shadow-xl transition-all duration-500 ease-in-out transform hover:-translate-y-1 bg-transparent'
      )}
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
    >
      <CardContent className="p-4">
        <div className="aspect-square relative overflow-hidden rounded-md shadow-sm group-hover:shadow-lg transition-shadow">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover rounded-md transition-transform duration-500 ease-in-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint="product image"
          />
        </div>
        <div className="pt-4 text-left">
          <h3 className="font-headline text-lg font-semibold text-gray-800 group-hover:text-yellow-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
          <p className="text-md text-yellow-600 font-bold mt-2">${product.price.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
