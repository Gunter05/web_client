import {
  fitWithin,
  PHOTO_MAX_HEIGHT,
  PHOTO_MAX_WIDTH,
} from "@/modules/medias/domain/photo";

/**
 * Ramène une photo au format d'affichage (1080 × 1350 au plus) en WebP, dans
 * le navigateur, avant l'envoi : une photo de téléphone de plusieurs Mo pèse
 * ensuite quelques centaines de Ko. Si le navigateur ne sait pas le faire, la
 * photo d'origine est envoyée telle quelle.
 */
export async function compressPhoto(file: File): Promise<Blob> {
  try {
    // L'orientation EXIF est appliquée par createImageBitmap
    const image = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });
    const { width, height } = fitWithin(
      image.width,
      image.height,
      PHOTO_MAX_WIDTH,
      PHOTO_MAX_HEIGHT,
    );
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d")?.drawImage(image, 0, 0, width, height);
    image.close();
    const compressed = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.85),
    );
    // Safari ancien ne sait pas écrire du WebP : il renvoie du PNG, souvent plus lourd
    if (!compressed || compressed.type !== "image/webp") return file;
    return compressed.size < file.size ? compressed : file;
  } catch {
    return file;
  }
}
