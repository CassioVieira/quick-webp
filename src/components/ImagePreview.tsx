import React from 'react';
import { FileImage, Download, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatFileSize } from '@/lib/image-utils';

interface ImagePreviewProps {
  file: File;
  convertedDataUrl?: string;
  originalSize: number;
  convertedSize?: number;
  onRemove: () => void;
  onDownload: (size: string) => void;
  isConverting?: boolean;
}

const downloadSizes = [
  { label: 'Hero/Banner (1920×1080)', value: '1920x1080' },
  { label: 'Post de Blog (1200×800)', value: '1200x800' },
  { label: 'Thumbnail (300×300)', value: '300x300' },
  { label: 'Logo/Ícone (100×100)', value: '100x100' },
  { label: 'Tamanho Original', value: 'original' }
];

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  file,
  convertedDataUrl,
  originalSize,
  convertedSize,
  onRemove,
  onDownload,
  isConverting
}) => {
  const originalUrl = URL.createObjectURL(file);
  const compressionRatio = convertedSize ? Math.round(((originalSize - convertedSize) / originalSize) * 100) : 0;

  return (
    <div className="gradient-card shadow-medium rounded-xl p-6 space-y-6">
      {/* Header com informações do arquivo */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileImage className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground truncate max-w-[200px]">
              {file.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {formatFileSize(originalSize)}
            </p>
          </div>
        </div>
        
        <button
          onClick={onRemove}
          className="w-8 h-8 rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-smooth"
        >
          <Trash2 className="w-4 h-4 mx-auto" />
        </button>
      </div>

      {/* Preview das imagens */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Imagem Original */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Original</h4>
          <div className="relative rounded-lg overflow-hidden bg-muted">
            <img
              src={originalUrl}
              alt="Preview original"
              className="w-full h-40 object-cover"
            />
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
              {file.type.split('/')[1].toUpperCase()}
            </div>
          </div>
        </div>

        {/* Imagem Convertida */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">WebP Convertido</h4>
          <div className="relative rounded-lg overflow-hidden bg-muted">
            {convertedDataUrl ? (
              <>
                <img
                  src={convertedDataUrl}
                  alt="Preview convertido"
                  className="w-full h-40 object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-success/80 text-success-foreground text-xs rounded">
                  WebP
                </div>
                {convertedSize && (
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
                    -{compressionRatio}%
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-40 flex items-center justify-center">
                {isConverting ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-muted-foreground">Convertendo...</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Aguardando conversão</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Estatísticas de compressão */}
      {convertedSize && (
        <div className="gradient-success text-success-foreground rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Economia de espaço:</span>
            <span className="text-lg font-bold">{compressionRatio}%</span>
          </div>
          <div className="text-sm opacity-90">
            De {formatFileSize(originalSize)} para {formatFileSize(convertedSize)}
          </div>
        </div>
      )}

      {/* Opções de download */}
      {convertedDataUrl && (
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Download em diferentes tamanhos:</h4>
          <div className="grid gap-2">
            {downloadSizes.map((size) => (
              <button
                key={size.value}
                onClick={() => onDownload(size.value)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border transition-smooth",
                  "hover:bg-accent hover:border-primary/50 hover:scale-[1.01]"
                )}
              >
                <span className="text-sm font-medium">{size.label}</span>
                <Download className="w-4 h-4 text-primary" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};