import React from 'react';
import { RefreshCw, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConversionButtonProps {
  onClick: () => void;
  isConverting: boolean;
  isConverted: boolean;
  disabled?: boolean;
}

export const ConversionButton: React.FC<ConversionButtonProps> = ({
  onClick,
  isConverting,
  isConverted,
  disabled
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isConverting}
      className={cn(
        "flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-smooth",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        isConverted 
          ? "gradient-success text-success-foreground shadow-medium hover:scale-105" 
          : "gradient-primary text-primary-foreground shadow-medium hover:scale-105"
      )}
    >
      {isConverting ? (
        <>
          <RefreshCw className="w-5 h-5 animate-spin" />
          Convertendo para WebP...
        </>
      ) : isConverted ? (
        <>
          <CheckCircle className="w-5 h-5" />
          Convertido com Sucesso!
        </>
      ) : (
        <>
          <RefreshCw className="w-5 h-5" />
          Converter para WebP
        </>
      )}
    </button>
  );
};