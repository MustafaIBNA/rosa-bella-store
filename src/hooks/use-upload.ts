
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
    // This function returns a Promise that will resolve with the download URL or reject with an error.
    return new Promise(async (resolve, reject) => {
      if (!file) {
        const err = "No file provided for upload.";
        setError(err);
        toast({ variant: "destructive", title: "Upload Failed", description: err });
        return reject(new Error(err));
      }

      setIsUploading(true);
      setError(null);
      setProgress(0);

      try {
        toast({ title: "Compressing image...", description: "Please wait." });
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);

        const fileExtension = compressedFile.name.split('.').pop() || 'jpg';
        const fileName = `products/${uuidv4()}.${fileExtension}`;
        const storageRef = ref(storage, fileName);
        
        const uploadTask = uploadBytesResumable(storageRef, compressedFile);

        uploadTask.on('state_changed',
          (snapshot) => {
            // This is the progress callback.
            const currentProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(currentProgress);
          },
          (uploadError) => {
            // This is the error callback. This is CRITICAL.
            console.error("Upload failed:", uploadError);
            const errorMessage = uploadError.code === 'storage/unauthorized' 
                ? "Permission denied. Please check your Firebase Storage security rules to allow writes."
                : `Upload failed: ${uploadError.message}`;
            
            setError(errorMessage);
            setIsUploading(false);
            setProgress(0);
            toast({
              variant: "destructive",
              title: "Upload Failed",
              description: errorMessage,
            });

            // Rejecting the promise is essential to let the calling component know about the failure.
            reject(new Error(errorMessage));
          },
          async () => {
            // This is the completion callback.
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              setProgress(100);
              setIsUploading(false);
              // Resolving the promise with the URL is how the caller gets the result.
              resolve(downloadURL);
            } catch (urlError: any) {
              const errorMessage = "Upload succeeded, but failed to get the download URL.";
              console.error(errorMessage, urlError);
              setError(errorMessage);
              setIsUploading(false);
              toast({ variant: "destructive", title: "URL Fetch Failed", description: errorMessage });
              reject(new Error(errorMessage));
            }
          }
        );
      } catch (compressionError: any) {
        const errorMessage = `Image compression failed: ${compressionError.message}`;
        console.error(errorMessage, compressionError);
        setError(errorMessage);
        setIsUploading(false);
        toast({ variant: "destructive", title: "Upload Failed", description: errorMessage });
        reject(new Error(errorMessage));
      }
    });
  };

  return { upload, isUploading, progress, error };
}
