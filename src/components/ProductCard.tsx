'use client';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <Card className="group w-full max-w-sm overflow-hidden">
        <CardHeader className="p-0">
          <div className="aspect-square relative overflow-hidden">
            <Skeleton className="h-full w-full" />
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3 mt-1" />
          <Skeleton className="h-8 w-20 mt-2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'group w-full max-w-sm overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 animate-in fade-in-0 zoom-in-95 border-none shadow-lg rounded-xl'
      )}
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
    >
      <CardHeader className="p-0">
        <div className="aspect-[4/3] relative overflow-hidden rounded-t-xl">
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
      <CardContent className="p-6 bg-card">
        <div className="flex justify-between items-start">
            <CardTitle className="font-headline text-xl mb-2 leading-tight">{product.name}</CardTitle>
            <p className="text-lg font-bold text-primary whitespace-nowrap ml-4">${product.price.toFixed(2)}</p>
        </div>
        <p className="text-muted-foreground text-sm line-clamp-3">{product.description}</p>
      </CardContent>
    </Card>
  );
}
