'use client';
import { ProductProvider } from '@/context/ProductContext';
import { Toaster } from '@/components/ui/toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProductProvider>
      {children}
      <Toaster />
    </ProductProvider>
  );
}
