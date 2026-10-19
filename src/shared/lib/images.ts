/** Formats et taille des photos (US-11), vérifiés avant l'envoi puis par l'API. */
export const TYPES_IMAGE = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export type ImageError = "invalidPhoto" | "photoTooLarge";

export function checkImage(file: File): ImageError | null {
  if (!(TYPES_IMAGE as readonly string[]).includes(file.type)) {
    return "invalidPhoto";
  }
  if (file.size > MAX_IMAGE_SIZE) return "photoTooLarge";
  return null;
}
