'use client';
import { ProductProvider } from '@/context/ProductContext';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/CartContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProductProvider>
      <CartProvider>
        {children}
        <Toaster />
      </CartProvider>
    </ProductProvider>
  );
}
