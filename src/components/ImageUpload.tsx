import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isValidImageFile } from '@/lib/image-utils';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  isLoading?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, isLoading }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => isValidImageFile(file));
    
    if (imageFile) {
      onImageSelect(imageFile);
    }
  }, [onImageSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isValidImageFile(file)) {
      onImageSelect(file);
    }
  }, [onImageSelect]);

  return (
    <div
      className={cn(
        "relative border-2 border-dashed border-border rounded-xl p-8 text-center transition-smooth",
        "hover:border-primary/50 hover:bg-accent/50",
        isDragOver && "border-primary bg-accent scale-[1.02]",
        isLoading && "pointer-events-none opacity-50"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-4">
        <div className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center transition-smooth",
          isDragOver ? "gradient-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
        )}>
          <Upload className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Arraste sua imagem aqui
          </h3>
          <p className="text-sm text-muted-foreground">
            Suporte para PNG e JPG até 10MB
          </p>
        </div>

        <label className="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-primary-foreground rounded-lg font-medium cursor-pointer transition-smooth hover:scale-105 hover:shadow-medium">
          <ImageIcon className="w-4 h-4" />
          Selecionar Arquivo
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileInput}
            className="hidden"
            disabled={isLoading}
          />
        </label>
      </div>
    </div>
  );
};