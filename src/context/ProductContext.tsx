'use client';
import { createContext, useState, ReactNode, useMemo } from 'react';
import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const initialProducts: Product[] = PlaceHolderImages.map((img, index) => ({
  id: img.id,
  name: img.imageHint.charAt(0).toUpperCase() + img.imageHint.slice(1),
  description: img.description,
  price: parseFloat((Math.random() * (40 - 15) + 15).toFixed(2)),
  imageUrl: img.imageUrl,
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

  const value = useMemo(() => ({ products, addProduct, editProduct, deleteProduct }), [products]);

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}
