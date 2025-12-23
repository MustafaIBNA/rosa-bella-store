
'use client';

import { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';
import { useFirebaseApp } from '@/firebase';
import { useToast } from './use-toast';

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);

  const firebaseApp = useFirebaseApp();
  const storage = getStorage(firebaseApp);
  const { toast } = useToast();

  const upload = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setError(null);
    setDownloadURL(null);

    try {
      // 1. Compress the image
      toast({ title: 'Compressing Image...', description: 'Please wait.' });
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      // 2. Upload the compressed file to Firebase Storage
      toast({ title: 'Uploading Image...', description: 'Your image is being uploaded.' });
      const fileExtension = compressedFile.name.split('.').pop() || 'jpg';
      const fileName = `products/${uuidv4()}.${fileExtension}`;
      const storageRef = ref(storage, fileName);
      
      const uploadTask = await uploadBytes(storageRef, compressedFile);
      
      // 3. Get the download URL
      const url = await getDownloadURL(uploadTask.ref);
      
      setDownloadURL(url);
      setIsUploading(false);
      toast({ title: 'Upload Successful', description: 'Image is ready.' });
      
      return url;

    } catch (e: any) {
      console.error("Upload failed:", e);
      const errorMessage = e.message || 'An unknown error occurred during upload.';
      setError(errorMessage);
      setIsUploading(false);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: errorMessage,
      });
      return null;
    }
  };

  return { upload, isUploading, error, downloadURL };
}
