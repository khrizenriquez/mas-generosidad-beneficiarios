const MAX_SOURCE_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function canvasToBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error('No fue posible procesar la imagen.')),
      'image/webp',
      quality,
    );
  });
}

async function resize(bitmap, maxWidth, maxHeight, quality) {
  const ratio = Math.min(maxWidth / bitmap.width, maxHeight / bitmap.height, 1);
  const width = Math.max(1, Math.round(bitmap.width * ratio));
  const height = Math.max(1, Math.round(bitmap.height * ratio));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  context.drawImage(bitmap, 0, 0, width, height);
  return canvasToBlob(canvas, quality);
}

export async function processImage(file) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error('Usa una imagen JPG, PNG o WebP.');
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error('Cada archivo debe pesar como máximo 10 MB.');
  }

  const bitmap = await createImageBitmap(file, {
    imageOrientation: 'from-image',
  });
  try {
    const [thumbnail, detail] = await Promise.all([
      resize(bitmap, 640, 480, 0.78),
      resize(bitmap, 1600, 1200, 0.84),
    ]);
    return { thumbnail, detail };
  } finally {
    bitmap.close();
  }
}
