/** Formats et taille des photos (US-11), vérifiés avant l'envoi puis par l'API. */
export const TYPES_IMAGE = ["image/jpeg", "image/png", "image/webp"] as const;
export const TAILLE_MAX_IMAGE = 5 * 1024 * 1024;

export type ErreurImage = "formatImage" | "tailleImage";

export function verifierImage(fichier: File): ErreurImage | null {
  if (!(TYPES_IMAGE as readonly string[]).includes(fichier.type)) {
    return "formatImage";
  }
  if (fichier.size > TAILLE_MAX_IMAGE) return "tailleImage";
  return null;
}
