import React, { useState, useCallback } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { ImagePreview } from '@/components/ImagePreview';
import { ConversionButton } from '@/components/ConversionButton';
import { Zap, Shield, TrendingUp } from 'lucide-react';

interface ConvertedImage {
  dataUrl: string;
  size: number;
}

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [convertedImage, setConvertedImage] = useState<ConvertedImage | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const handleImageSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setConvertedImage(null);
  }, []);

  const handleRemoveImage = useCallback(() => {
    setSelectedFile(null);
    setConvertedImage(null);
  }, []);

  const convertToWebP = useCallback(async () => {
    if (!selectedFile) return;

    setIsConverting(true);

    try {
      // Simular conversão (em produção seria feita no servidor ou com bibliotecas específicas)
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      await new Promise((resolve, reject) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const reader = new FileReader();
                reader.onload = () => {
                  setConvertedImage({
                    dataUrl: reader.result as string,
                    size: blob.size
                  });
                  resolve(blob);
                };
                reader.readAsDataURL(blob);
              } else {
                reject(new Error('Conversão falhou'));
              }
            },
            'image/webp',
            0.8 // 80% quality
          );
        };

        img.onerror = reject;
        img.src = URL.createObjectURL(selectedFile);
      });
    } catch (error) {
      console.error('Erro na conversão:', error);
    } finally {
      setIsConverting(false);
    }
  }, [selectedFile]);

  const handleDownload = useCallback(async (sizeOption: string) => {
    if (!selectedFile || !convertedImage) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Ajustar dimensões baseado na opção selecionada
      switch (sizeOption) {
        case '1920x1080':
          width = 1920;
          height = 1080;
          break;
        case '1200x800':
          width = 1200;
          height = 800;
          break;
        case '300x300':
          width = 300;
          height = 300;
          break;
        case '100x100':
          width = 100;
          height = 100;
          break;
        default:
          // Manter tamanho original
          break;
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${selectedFile.name.split('.')[0]}_${sizeOption}.webp`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        },
        'image/webp',
        0.8
      );
    };

    img.src = convertedImage.dataUrl;
  }, [selectedFile, convertedImage]);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Conversor de Imagens para{' '}
            <span className="gradient-primary bg-clip-text text-transparent">WebP</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Reduza o tamanho das suas imagens sem perder qualidade. 
            Converta PNG e JPG para WebP de forma rápida e gratuita.
          </p>
        </header>

        {/* Upload Area */}
        {!selectedFile && (
          <div className="gradient-card shadow-soft rounded-xl p-6">
            <ImageUpload onImageSelect={handleImageSelect} isLoading={isConverting} />
          </div>
        )}

        {/* Preview and Conversion */}
        {selectedFile && (
          <div className="space-y-6">
            <ImagePreview
              file={selectedFile}
              convertedDataUrl={convertedImage?.dataUrl}
              originalSize={selectedFile.size}
              convertedSize={convertedImage?.size}
              onRemove={handleRemoveImage}
              onDownload={handleDownload}
              isConverting={isConverting}
            />

            {!convertedImage && (
              <div className="flex justify-center">
                <ConversionButton
                  onClick={convertToWebP}
                  isConverting={isConverting}
                  isConverted={!!convertedImage}
                />
              </div>
            )}
          </div>
        )}

        {/* Information Section */}
        <section className="gradient-card shadow-soft rounded-xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center text-foreground">
            Por que usar WebP?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">Mais Rápido</h3>
              <p className="text-sm text-muted-foreground">
                Imagens menores carregam mais rapidamente, melhorando a experiência do usuário.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 gradient-success rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 text-success-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">Qualidade Preservada</h3>
              <p className="text-sm text-muted-foreground">
                Reduz até 80% do tamanho sem perda significativa de qualidade visual.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">Melhor SEO</h3>
              <p className="text-sm text-muted-foreground">
                Sites mais rápidos são melhor ranqueados pelo Google e outros buscadores.
              </p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-muted-foreground">
              <strong>O WebP é um formato otimizado para web</strong>, desenvolvido pelo Google, 
              que reduz significativamente o tamanho dos arquivos sem comprometer a qualidade. 
              Ideal para sites rápidos e bem posicionados nos motores de busca.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;