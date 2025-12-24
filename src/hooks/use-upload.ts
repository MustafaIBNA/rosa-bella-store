
'use client';

import { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';
import { useFirebaseApp } from '@/firebase';
import { useToast } from './use-toast';

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const firebaseApp = useFirebaseApp();
  const storage = getStorage(firebaseApp);
  const { toast } = useToast();

  const upload = (file: File): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      setIsUploading(true);
      setError(null);
      setProgress(0);

      if (!file) {
        const err = "No file provided for upload.";
        setError(err);
        setIsUploading(false);
        reject(err);
        return;
      }

      try {
        // 1. Compress the image
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);

        // 2. Set up storage reference
        const fileExtension = compressedFile.name.split('.').pop() || 'jpg';
        const fileName = `products/${uuidv4()}.${fileExtension}`;
        const storageRef = ref(storage, fileName);

        // 3. Start the resumable upload
        const uploadTask = uploadBytesResumable(storageRef, compressedFile);

        // 4. Listen for state changes, errors, and completion
        uploadTask.on('state_changed',
          (snapshot) => {
            // Update progress
            const currentProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(currentProgress);
          },
          (uploadError) => {
            // Handle unsuccessful uploads
            console.error("Upload failed:", uploadError);
            const errorMessage = uploadError.code === 'storage/unauthorized' 
                ? "Permission denied. Check your Firebase Storage security rules."
                : uploadError.message;
            setError(errorMessage);
            setIsUploading(false);
            toast({
              variant: "destructive",
              title: "Upload Failed",
              description: errorMessage,
            });
            reject(new Error(errorMessage));
          },
          async () => {
            // Handle successful uploads on complete
            try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                setProgress(100);
                setIsUploading(false);
                resolve(downloadURL);
            } catch (urlError) {
                console.error("Failed to get download URL:", urlError);
                const errorMessage = "Upload succeeded, but failed to get the download URL.";
                setError(errorMessage);
                setIsUploading(false);
                toast({
                  variant: "destructive",
                  title: "URL Fetch Failed",
                  description: errorMessage,
                });
                reject(new Error(errorMessage));
            }
          }
        );
      } catch (e: any) {
        console.error("Compression or setup failed:", e);
        const errorMessage = e.message || 'An unknown error occurred before upload.';
        setError(errorMessage);
        setIsUploading(false);
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: errorMessage,
        });
        reject(new Error(errorMessage));
      }
    });
  };

  return { upload, isUploading, progress, error };
}
