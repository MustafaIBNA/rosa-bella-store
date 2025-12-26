
'use client';

import { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, UploadTaskSnapshot, FirebaseStorageError } from 'firebase/storage';
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
        toast({ title: "Compressing image...", description: "Please wait, this may take a moment." });
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        toast({ title: "Compression complete!", description: "Starting upload to storage..." });

        const fileExtension = compressedFile.name.split('.').pop() || 'jpg';
        const fileName = `products/${uuidv4()}.${fileExtension}`;
        const storageRef = ref(storage, fileName);
        
        const uploadTask = uploadBytesResumable(storageRef, compressedFile);

        const progressCallback = (snapshot: UploadTaskSnapshot) => {
          const currentProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(currentProgress);
        };

        const errorCallback = (uploadError: FirebaseStorageError) => {
          console.error("Upload failed inside error callback:", uploadError);
          const errorMessage = uploadError.code === 'storage/unauthorized'
            ? "Permission Denied: Your security rules are blocking the upload."
            : `Upload failed: ${uploadError.message}`;

          setError(errorMessage);
          setIsUploading(false);
          setProgress(0);
          toast({
            variant: "destructive",
            title: "Upload Failed",
            description: errorMessage,
          });

          // This is critical for the form to stop its submitting state
          reject(new Error(errorMessage));
        };

        const completionCallback = async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setProgress(100);
            setIsUploading(false);
            toast({ title: "Upload Complete!", description: "Image successfully uploaded." });
            resolve(downloadURL);
          } catch (urlError) {
            console.error("Failed to get download URL:", urlError);
            const errorMessage = "Upload succeeded, but failed to get the download URL.";
            setError(errorMessage);
            setIsUploading(false);
            toast({ variant: "destructive", title: "URL Fetch Failed", description: errorMessage });
            reject(new Error(errorMessage));
          }
        };

        uploadTask.on('state_changed', progressCallback, errorCallback, completionCallback);

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
