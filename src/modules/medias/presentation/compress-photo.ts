import { rgbaToThumbHash } from "thumbhash";
import {
  fitWithin,
  isAcceptedType,
  MAX_PHOTO_SIZE,
  PHOTO_MAX_HEIGHT,
  PHOTO_MAX_WIDTH,
  type PhotoError,
} from "@/modules/medias/domain/photo";

/** La photo ne peut pas être préparée ; `code` est la clé `errors.*` à afficher. */
export class PhotoPreparationError extends Error {
  constructor(readonly code: PhotoError) {
    super(code);
  }
}

/** Photo prête à l'envoi, avec ce qu'il faut pour l'afficher sans saut. */
export type PreparedPhoto = {
  blob: Blob;
  width: number;
  height: number;
  /** Aperçu flou : ThumbHash en base64, `null` si le navigateur n'a pas pu le calculer. */
  placeholder: string | null;
};

/**
 * Ramène une photo au format d'affichage (1080 × 1350 au plus) en WebP, dans
 * le navigateur, avant l'envoi : une photo de téléphone de plusieurs Mo pèse
 * ensuite quelques centaines de Ko. Calcule au passage ses dimensions et un
 * aperçu flou de quelques dizaines d'octets (ThumbHash), pour que le site
 * réserve sa place et l'affiche pendant le chargement.
 *
 * Toute image lisible par le navigateur est convertie, quel que soit son nom
 * ou son type annoncé (HEIC, fichier « .png » qui contient autre chose…) : le
 * serveur reçoit toujours un vrai JPEG, PNG ou WebP. L'original n'est gardé
 * que s'il est déjà dans un format accepté, plus léger et sous 5 Mo.
 *
 * @throws PhotoPreparationError si l'image ne peut pas être lue ou reste trop lourde
 */
export async function preparePhoto(file: File): Promise<PreparedPhoto> {
  const original = isAcceptedType(file.type) ? file : null;
  let image: ImageBitmap;
  try {
    // L'orientation EXIF est appliquée par createImageBitmap
    image = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    // Illisible ici : seul un fichier déjà au bon format peut partir tel quel
    if (!original) throw new PhotoPreparationError("photoUnreadable");
    if (original.size > MAX_PHOTO_SIZE) {
      throw new PhotoPreparationError("photoTooLarge");
    }
    return { blob: original, width: 0, height: 0, placeholder: null };
  }
  const source = { width: image.width, height: image.height };
  const { width, height } = fitWithin(
    image.width,
    image.height,
    PHOTO_MAX_WIDTH,
    PHOTO_MAX_HEIGHT,
  );
  const placeholder = thumbHash(image);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")?.drawImage(image, 0, 0, width, height);
  image.close();
  // Safari ancien ne sait pas écrire du WebP : il renvoie du PNG, accepté aussi
  const converted = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.85),
  );
  const usable =
    converted && isAcceptedType(converted.type) && converted.size > 0
      ? converted
      : null;
  const keepOriginal =
    original &&
    original.size <= MAX_PHOTO_SIZE &&
    (!usable || original.size <= usable.size);
  if (keepOriginal) {
    return { blob: original, ...source, placeholder };
  }
  if (!usable) throw new PhotoPreparationError("photoUnreadable");
  if (usable.size > MAX_PHOTO_SIZE) {
    throw new PhotoPreparationError("photoTooLarge");
  }
  return { blob: usable, width, height, placeholder };
}

/** Aperçu flou de la photo : ThumbHash calculé sur une miniature de 100 px au plus. */
function thumbHash(image: ImageBitmap): string | null {
  try {
    const { width, height } = fitWithin(image.width, image.height, 100, 100);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.drawImage(image, 0, 0, width, height);
    const pixels = context.getImageData(0, 0, width, height).data;
    const hash = rgbaToThumbHash(width, height, pixels);
    return btoa(String.fromCharCode(...hash));
  } catch {
    return null;
  }
}
