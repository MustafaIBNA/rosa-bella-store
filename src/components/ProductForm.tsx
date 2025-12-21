'use client';

import { useContext, useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProductContext } from '@/context/ProductContext';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import Image from 'next/image';
import { useFirebaseApp } from '@/firebase';
import { Upload } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  imageUrl: z.string().url({ message: 'Please enter a valid image URL.' }).optional().or(z.literal('')),
  category: z.string().min(1, { message: 'Category is required.' }),
  imageFile: z.instanceof(File).optional(),
}).refine(data => data.imageUrl || data.imageFile, {
  message: 'Either an image URL or an image file is required.',
  path: ['imageFile'],
});


type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  productToEdit: Product | null;
  onFinished: () => void;
}

export function ProductForm({ productToEdit, onFinished }: ProductFormProps) {
  const { addProduct, editProduct } = useContext(ProductContext);
  const { toast } = useToast();
  const firebaseApp = useFirebaseApp();
  const storage = getStorage(firebaseApp);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      category: '',
      imageFile: undefined,
    },
  });

  useEffect(() => {
    if (productToEdit) {
      form.reset({
        ...productToEdit,
        imageFile: undefined,
      });
      setImagePreview(productToEdit.imageUrl);
    } else {
      form.reset({
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        category: '',
        imageFile: undefined,
      });
      setImagePreview(null);
    }
  }, [productToEdit, form]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('imageFile', file, { shouldValidate: true });
      form.setValue('imageUrl', ''); 
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const compressAndUploadImage = async (file: File): Promise<string> => {
    toast({ title: 'Compressing Image...', description: 'Preparing your image for upload.' });
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    const compressedFile = await imageCompression(file, options);

    toast({ title: 'Uploading Image...', description: 'Please wait while we upload your new image.' });
    const fileExtension = compressedFile.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const storageRef = ref(storage, `products/${fileName}`);
    await uploadBytes(storageRef, compressedFile);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    
    try {
      let finalImageUrl = productToEdit?.imageUrl || '';

      if (data.imageFile) {
        finalImageUrl = await compressAndUploadImage(data.imageFile);
      }

      if (!finalImageUrl) {
        throw new Error("Image is required. Please upload an image or provide a URL.");
      }

      const formattedData = {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category.trim().charAt(0).toUpperCase() + data.category.trim().slice(1).toLowerCase(),
        imageUrl: finalImageUrl,
      };

      if (productToEdit) {
        editProduct({ ...productToEdit, ...formattedData });
        toast({ title: 'Product Updated', description: `"${formattedData.name}" has been successfully updated.` });
      } else {
        addProduct(formattedData);
        toast({ title: 'Product Added', description: `"${formattedData.name}" has been successfully added.` });
      }
      
      onFinished();
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred while saving the product. Please try again.";
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Lavender Dream Candle" {...field} />
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
                <Textarea placeholder="Describe the product..." {...field} />
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
                  <Input type="number" step="0.01" placeholder="e.g., 24.99" {...field} />
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
                  <Input placeholder="e.g., Candle" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="imageFile"
          render={() => (
            <FormItem>
                <FormLabel>Product Image</FormLabel>
                <FormControl>
                    <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        disabled={isSubmitting}
                    />
                </FormControl>
                <div
                    className="w-full h-48 border-2 border-dashed border-muted rounded-lg flex items-center justify-center text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => !isSubmitting && fileInputRef.current?.click()}
                >
                    {imagePreview ? (
                        <div className="relative w-full h-full">
                            <Image src={imagePreview} alt="Product preview" fill className="object-contain rounded-md" />
                        </div>
                    ) : (
                        <div className="text-center">
                            <Upload className="mx-auto h-8 w-8" />
                            <p>Click to upload an image</p>
                            <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    )}
                </div>
                <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (productToEdit ? 'Save Changes' : 'Create Product')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
