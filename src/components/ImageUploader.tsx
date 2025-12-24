
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface ImageUploaderProps {
  initialImageUrl: string | null;
  onFileSelect: (file: File | null) => void;
  isUploading: boolean;
  progress: number; // New prop for real progress
  disabled: boolean;
}

export function ImageUploader({
  initialImageUrl,
  onFileSelect,
  isUploading,
  progress,
  disabled,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(initialImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(initialImageUrl);
  }, [initialImageUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileSelect(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setPreview(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleContainerClick = () => {
    if (!disabled && !preview) {
        fileInputRef.current?.click();
    }
  }

  return (
    <div className="space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Product Image
        </label>
        <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={disabled}
        />
        <div
            className="w-full h-48 border-2 border-dashed border-muted rounded-lg flex items-center justify-center text-muted-foreground relative group"
            onClick={handleContainerClick}
            role={!preview ? "button" : "figure"}
            aria-label="Upload product image"
        >
            {preview ? (
                <>
                    <Image src={preview} alt="Product preview" fill className="object-contain rounded-md" />
                    {!disabled && (
                         <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={handleRemoveImage}
                            aria-label="Remove image"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </>
            ) : (
                <div className="text-center cursor-pointer">
                    <Upload className="mx-auto h-8 w-8" />
                    <p>Click to upload an image</p>
                    <p className="text-xs">PNG, JPG up to 5MB</p>
                </div>
            )}
        </div>
        {isUploading && (
             <div className="space-y-1">
                 <p className="text-sm text-muted-foreground">Uploading... {Math.round(progress)}%</p>
                 <Progress value={progress} className="h-2" />
             </div>
        )}
    </div>
  );
}
