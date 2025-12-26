
'use client';
import { useContext, useState, useMemo } from 'react';
import { ProductContext } from '@/context/ProductContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import Image from 'next/image';
import { Edit, PlusCircle, Trash2 } from 'lucide-react';
import { ProductForm } from './ProductForm';
import type { Product } from '@/lib/types';
import { Skeleton } from './ui/skeleton';
import { Checkbox } from './ui/checkbox';
import { useToast } from '@/hooks/use-toast';

export function AdminDashboard() {
  const { products, deleteProduct, deleteMultipleProducts, isLoading } = useContext(ProductContext);
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [showDeleteMultipleDialog, setShowDeleteMultipleDialog] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const handleAddNew = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingProduct) {
      deleteProduct(deletingProduct.id);
      setDeletingProduct(null);
      toast({ title: "Product Deleted", description: `"${deletingProduct.name}" has been removed.` });
    }
  };

  const handleDeleteMultipleConfirm = async () => {
    if (selectedProducts.length > 0) {
      await deleteMultipleProducts(selectedProducts);
      toast({ title: "Products Deleted", description: `${selectedProducts.length} products have been removed.` });
      setSelectedProducts([]);
    }
    setShowDeleteMultipleDialog(false);
  };

  const onFormFinished = () => {
    setDialogOpen(false);
    setEditingProduct(null);
  }

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedProducts(products.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const isAllSelected = useMemo(() => {
    if (isLoading || products.length === 0) return false;
    return selectedProducts.length === products.length;
  }, [selectedProducts, products, isLoading]);
  
  const isIndeterminate = useMemo(() => {
    return selectedProducts.length > 0 && selectedProducts.length < products.length;
  }, [selectedProducts, products.length]);

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold font-headline">Product Management</h1>
          <div className="flex items-center gap-2">
            {selectedProducts.length > 0 && (
              <Button variant="destructive" onClick={() => setShowDeleteMultipleDialog(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete ({selectedProducts.length})
              </Button>
            )}
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </div>
        </div>
        <div className="border rounded-lg shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px] text-center">
                  <Checkbox
                    checked={isAllSelected || isIndeterminate}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all rows"
                  />
                </TableHead>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    <TableCell><Skeleton className="w-5 h-5 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="w-16 h-16 rounded-md" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Skeleton className="h-8 w-8 inline-block" />
                      <Skeleton className="h-8 w-8 inline-block" />
                    </TableCell>
                  </TableRow>
                ))
              ) : products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product.id} data-state={selectedProducts.includes(product.id) ? 'selected' : undefined}>
                    <TableCell className="text-center">
                       <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={(checked) => handleSelectProduct(product.id, !!checked)}
                        aria-label={`Select row for ${product.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>EGP {product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeletingProduct(product)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    No products yet. Add one to get started!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <ProductForm productToEdit={editingProduct} onFinished={onFormFinished} />
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!deletingProduct} onOpenChange={() => setDeletingProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              "{deletingProduct?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showDeleteMultipleDialog} onOpenChange={setShowDeleteMultipleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedProducts.length} selected products.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMultipleConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
