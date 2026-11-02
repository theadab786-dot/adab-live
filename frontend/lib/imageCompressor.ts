/**
 * Automatically compress and resize images in the browser before uploading.
 * Reduces 4MB-10MB phone camera photos to ~300KB-600KB crisp web-ready photos.
 * Ensures uploads stay well below Vercel serverless function payload limits (4.5MB).
 */
export async function compressImage(
  file: File,
  maxDimension = 1920,
  quality = 0.85
): Promise<File> {
  // If not running in browser, or SVG/GIF, return as is
  if (typeof window === "undefined" || !file.type) return file;
  if (file.type === "image/svg+xml" || file.type === "image/gif") return file;

  // Already tiny images (< 400 KB) don't need compression
  if (file.size <= 400 * 1024) return file;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          return resolve(file); // fallback to original file
        }

        // Draw image onto canvas with smooth scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Prefer image/jpeg for wide browser compatibility
        const outputType = file.type === "image/png" && file.size < 1024 * 1024 ? "image/png" : "image/jpeg";
        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              // If compressed blob is not smaller, keep original
              return resolve(file);
            }
            const compressedFile = new File([blob], file.name, {
              type: outputType,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          outputType,
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}
