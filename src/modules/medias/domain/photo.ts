/**
 * Règles des photos (US-11, ADR 0014 du backend), vérifiées dans le navigateur
 * avant l'envoi puis par l'API : formats, taille et dimensions d'affichage.
 */
export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export type PhotoType = (typeof PHOTO_TYPES)[number];

export const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

/**
 * Poids maximal du fichier choisi, avant sa réduction dans le navigateur : une
 * photo de téléphone de 8 Mo devient une image de quelques centaines de Ko.
 */
export const MAX_SOURCE_SIZE = 30 * 1024 * 1024;

/** Format d'affichage d'une affiche d'événement : portrait 4:5 au plus. */
export const PHOTO_MAX_WIDTH = 1080;
export const PHOTO_MAX_HEIGHT = 1350;

export type PhotoError =
  | "invalidPhoto"
  | "photoTooLarge"
  | "photoEmpty"
  | "photoNotAnImage"
  | "photoSourceTooLarge"
  | "photoUnreadable";

export function isAcceptedType(type: string): type is PhotoType {
  return (PHOTO_TYPES as readonly string[]).includes(type);
}

/**
 * Fichier choisi par la personne, avant sa réduction : toute image que le
 * navigateur sait lire est convertie ensuite (HEIC, type inconnu, etc.). Un
 * type vide est accepté : certains téléphones n'en donnent pas.
 */
export function checkSource(file: {
  type: string;
  size: number;
}): PhotoError | null {
  if (file.size <= 0) return "photoEmpty";
  if (file.type && !file.type.startsWith("image/")) return "photoNotAnImage";
  if (file.size > MAX_SOURCE_SIZE) return "photoSourceTooLarge";
  return null;
}

/** Image prête à l'envoi (après réduction), vérifiée aussi par le serveur. */
export function checkPhoto(file: {
  type: string;
  size: number;
}): PhotoError | null {
  if (!isAcceptedType(file.type)) return "invalidPhoto";
  if (file.size <= 0) return "photoEmpty";
  if (file.size > MAX_PHOTO_SIZE) return "photoTooLarge";
  return null;
}

/**
 * Dimensions d'une image réduite pour tenir dans le cadre, sans l'agrandir
 * ni la déformer (même rapport largeur / hauteur).
 */
export function fitWithin(
  width: number,
  height: number,
  maxWidth = PHOTO_MAX_WIDTH,
  maxHeight = PHOTO_MAX_HEIGHT,
): { width: number; height: number } {
  const scale = Math.min(1, maxWidth / width, maxHeight / height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

/** Adresse d'un média de l'API : la seule adresse de photo enregistrable. */
export const MEDIA_URL_PATTERN = /^\/api\/v1\/medias\/[0-9a-f-]{36}$/;

export function isMediaUrl(value: string): boolean {
  return MEDIA_URL_PATTERN.test(value);
}
