'use client';
import { createContext, ReactNode, useMemo } from 'react';
import type { Product } from '@/lib/types';
import {
  useFirestore,
  useCollection,
  useMemoFirebase,
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
  deleteDocumentNonBlocking,
} from '@/firebase';
import { collection, doc } from 'firebase/firestore';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  editProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  isLoading: boolean;
}

export const ProductContext = createContext<ProductContextType>({
  products: [],
  addProduct: () => {},
  editProduct: () => {},
  deleteProduct: () => {},
  isLoading: true,
});

export function ProductProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();

  const productsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'products');
  }, [firestore]);

  const { data: products, isLoading } = useCollection<Product>(productsCollection);

  const addProduct = (product: Omit<Product, 'id'>) => {
    if (!productsCollection) return;
    addDocumentNonBlocking(productsCollection, product);
  };

  const editProduct = (updatedProduct: Product) => {
    if (!firestore) return;
    const { id, ...data } = updatedProduct;
    const productRef = doc(firestore, 'products', id);
    updateDocumentNonBlocking(productRef, data);
  };

  const deleteProduct = (id: string) => {
    if (!firestore) return;
    const productRef = doc(firestore, 'products', id);
    deleteDocumentNonBlocking(productRef);
  };

  const value = useMemo(
    () => ({
      products: products || [],
      addProduct,
      editProduct,
      deleteProduct,
      isLoading,
    }),
    [products, isLoading]
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}
