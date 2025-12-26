
'use client';
import { createContext, ReactNode, useMemo } from 'react';
import type { Product } from '@/lib/types';
import {
  useFirestore,
  useCollection,
  useMemoFirebase,
} from '@/firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import {
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
  deleteDocumentNonBlocking,
} from '@/firebase/non-blocking-updates';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  editProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  deleteMultipleProducts: (ids: string[]) => Promise<void>;
  isLoading: boolean;
}

export const ProductContext = createContext<ProductContextType>({
  products: [],
  addProduct: async () => {},
  editProduct: async () => {},
  deleteProduct: async () => {},
  deleteMultipleProducts: async () => {},
  isLoading: true,
});

export function ProductProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();

  const productsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'products');
  }, [firestore]);

  const { data: products, isLoading } = useCollection<Product>(productsCollection);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    if (!productsCollection) return;
    addDocumentNonBlocking(productsCollection, product);
  };

  const editProduct = async (updatedProduct: Product) => {
    if (!firestore) return;
    const { id, ...data } = updatedProduct;
    const productRef = doc(firestore, 'products', id);
    updateDocumentNonBlocking(productRef, data);
  };

  const deleteProduct = async (id: string) => {
    if (!firestore) return;
    const productRef = doc(firestore, 'products', id);
    deleteDocumentNonBlocking(productRef);
  };

  const deleteMultipleProducts = async (ids: string[]) => {
    if (!firestore) return;
    const batch = writeBatch(firestore);
    ids.forEach(id => {
      const productRef = doc(firestore, 'products', id);
      batch.delete(productRef);
    });
    // Batch writes should be awaited to ensure atomicity
    await batch.commit();
  };

  const value = useMemo(
    () => ({
      products: products || [],
      addProduct,
      editProduct,
      deleteProduct,
      deleteMultipleProducts,
      isLoading,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [products, isLoading, firestore]
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}
