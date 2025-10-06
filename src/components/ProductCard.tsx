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
    'group w-full max-w-sm overflow-hidden rounded-lg border-0 shadow-none transition-all duration-300 ease-in-out bg-transparent'
  )}
  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
>
  <CardContent className="p-0">
    <div className="aspect-square relative overflow-hidden rounded-md">
       <Image
        src={product.imageUrl}
        alt={product.name}
        fill
        className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 rounded-[4px]"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
    <div className="pt-4 text-left">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-base text-foreground">{product.name}</h3>
        <p className="text-md font-semibold text-accent-foreground/80">${product.price.toFixed(2)}</p>
      </div>
       <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
    </div>
  </CardContent>
</Card>
  );
}
