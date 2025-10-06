'use client';
import { createContext, useState, ReactNode, useMemo, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const initialProducts: Product[] = PlaceHolderImages.map((img) => ({
  id: img.id,
  name: img.imageHint.charAt(0).toUpperCase() + img.imageHint.slice(1),
  description: img.description,
  price: 0, // Initial price set to 0
  imageUrl: img.imageUrl,
  category: img.imageHint.toLowerCase().includes('candle') ? 'Candle' : 'Coaster',
}));

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  editProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
}

export const ProductContext = createContext<ProductContextType>({
  products: [],
  addProduct: () => {},
  editProduct: () => {},
  deleteProduct: () => {},
});

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    // Generate prices on the client side to avoid hydration errors
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.price === 0
          ? {
              ...p,
              price: parseFloat(
                (Math.random() * (40 - 15) + 15).toFixed(2)
              ),
            }
          : p
      )
    );
  }, []);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: new Date().toISOString() };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const editProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const value = useMemo(
    () => ({ products, addProduct, editProduct, deleteProduct }),
    [products]
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}
