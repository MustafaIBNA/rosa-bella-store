
'use client';

import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProductContext } from '@/context/ProductContext';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { ImageUploader } from './ImageUploader';
import { useUpload } from '@/hooks/use-upload';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  category: z.string().min(1, { message: 'Category is required.' }),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  productToEdit: Product | null;
  onFinished: () => void;
}

export function ProductForm({ productToEdit, onFinished }: ProductFormProps) {
  const { addProduct, editProduct } = useContext(ProductContext);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { upload, isUploading, progress, error: uploadError } = useUpload();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: productToEdit || {
      name: '',
      description: '',
      price: 0,
      category: '',
    },
  });

  useEffect(() => {
    form.reset(
      productToEdit || {
        name: '',
        description: '',
        price: 0,
        category: '',
      }
    );
    setImageFile(null);
  }, [productToEdit, form]);

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    
    try {
      let finalImageUrl = productToEdit?.imageUrl;

      if (imageFile) {
        // Await the upload to complete and get the URL
        const downloadURL = await upload(imageFile);
        finalImageUrl = downloadURL;
      }

      if (!finalImageUrl) {
        toast({
          variant: 'destructive',
          title: 'Image Required',
          description: 'Please select an image for the product.',
        });
        // We must stop the submission here.
        // The finally block will reset isSubmitting.
        return;
      }

      const productData = {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category.trim().charAt(0).toUpperCase() + data.category.trim().slice(1).toLowerCase(),
        imageUrl: finalImageUrl,
      };

      if (productToEdit) {
        await editProduct({ ...productToEdit, ...productData });
        toast({ title: 'Product Updated', description: `"${productData.name}" has been successfully updated.` });
      } else {
        await addProduct(productData);
        toast({ title: 'Product Added', description: `"${productData.name}" has been successfully added.` });
      }
      
      onFinished();

    } catch (error) {
      console.error("Error submitting product form:", error);
      // The useUpload hook already shows a toast for upload-specific errors.
      // This will catch other errors, like from the database write.
      if (!uploadError) {
          const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred during submission.";
          toast({
            variant: "destructive",
            title: "Submission Failed",
            description: errorMessage,
          });
      }
    } finally {
      // This block is CRITICAL. It guarantees that the form is re-enabled,
      // preventing the "freezing" issue, even if an error occurred.
      setIsSubmitting(false);
    }
  };
  
  const isFormBusy = isSubmitting || isUploading;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <ImageUploader 
            initialImageUrl={productToEdit?.imageUrl || null}
            onFileSelect={setImageFile}
            isUploading={isUploading}
            progress={progress}
            disabled={isFormBusy}
        />
        {uploadError && <p className='text-sm font-medium text-destructive'>{uploadError}</p>}
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Lavender Dream Candle" {...field} disabled={isFormBusy} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the product..." {...field} disabled={isFormBusy} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (EGP)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="e.g., 24.99" {...field} disabled={isFormBusy} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Candle" {...field} disabled={isFormBusy} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isFormBusy}>
            {isUploading ? `Uploading...` : (isSubmitting ? 'Saving...' : (productToEdit ? 'Save Changes' : 'Create Product'))}
          </Button>
        </div>
      </form>
    </Form>
  );
}
