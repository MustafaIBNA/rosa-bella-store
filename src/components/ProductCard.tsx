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
    'group w-full max-w-sm overflow-hidden rounded-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out hover:-translate-y-0.5 bg-[#FFFCF7]'
  )}
  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
>
  <CardContent className="p-3">
    <div className="aspect-square relative overflow-hidden rounded-xs">
      <Image
        src={product.imageUrl}
        alt={product.name}
        fill
        className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
    <div className="pt-3 text-left">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-base text-gray-900">{product.name}</h3>
        <p className="text-md font-semibold text-yellow-700">${product.price.toFixed(2)}</p>
      </div>
      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
    </div>
  </CardContent>
</Card>


  );
}
