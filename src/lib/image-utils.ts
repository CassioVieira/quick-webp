/**
 * Utilities for image processing and validation
 */

export const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'] as const;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const isValidImageFile = (file: File): boolean => {
  return ALLOWED_TYPES.includes(file.type as any) && file.size <= MAX_FILE_SIZE;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const resizeImage = (
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  // Maintain aspect ratio while fitting into target dimensions
  const aspectRatio = img.width / img.height;
  const targetAspectRatio = targetWidth / targetHeight;

  let drawWidth, drawHeight, drawX, drawY;

  if (aspectRatio > targetAspectRatio) {
    drawWidth = targetWidth;
    drawHeight = targetWidth / aspectRatio;
    drawX = 0;
    drawY = (targetHeight - drawHeight) / 2;
  } else {
    drawWidth = targetHeight * aspectRatio;
    drawHeight = targetHeight;
    drawX = (targetWidth - drawWidth) / 2;
    drawY = 0;
  }

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
};