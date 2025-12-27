
'use client';

import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { useToast } from './use-toast';

// Your Cloudinary credentials
const CLOUDINARY_CLOUD_NAME = 'dadih12ut';
const CLOUDINARY_UPLOAD_PRESET = 'rosabellastore_upload';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
const CLOUDINARY_FOLDER = 'products';

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
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
        toast({ title: "Compression complete!", description: "Starting upload to Cloudinary..." });

        const formData = new FormData();
        formData.append('file', compressedFile);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', CLOUDINARY_FOLDER);

        const xhr = new XMLHttpRequest();

        xhr.open('POST', CLOUDINARY_UPLOAD_URL, true);

        // Track upload progress
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const currentProgress = (event.loaded / event.total) * 100;
            setProgress(currentProgress);
          }
        };

        // Handle successful upload
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            const downloadURL = response.secure_url;
            
            setProgress(100);
            setIsUploading(false);
            toast({ title: "Upload Complete!", description: "Image successfully uploaded." });
            resolve(downloadURL);
          } else {
            // Handle HTTP errors
            const errorMessage = `Cloudinary upload failed: ${xhr.statusText}`;
            setError(errorMessage);
            setIsUploading(false);
            setProgress(0);
            toast({
              variant: "destructive",
              title: "Upload Failed",
              description: errorMessage,
            });
            reject(new Error(errorMessage));
          }
        };

        // Handle network errors
        xhr.onerror = () => {
          const errorMessage = "A network error occurred during the upload.";
          setError(errorMessage);
          setIsUploading(false);
          setProgress(0);
          toast({
            variant: "destructive",
            title: "Upload Failed",
            description: errorMessage,
          });
          reject(new Error(errorMessage));
        };
        
        xhr.send(formData);

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
