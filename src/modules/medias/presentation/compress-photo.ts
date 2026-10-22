import { rgbaToThumbHash } from "thumbhash";
import {
  fitWithin,
  PHOTO_MAX_HEIGHT,
  PHOTO_MAX_WIDTH,
} from "@/modules/medias/domain/photo";

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
 * réserve sa place et l'affiche pendant le chargement. Si le navigateur ne sait
 * pas compresser, la photo d'origine est envoyée telle quelle.
 */
export async function preparePhoto(file: File): Promise<PreparedPhoto> {
  let image: ImageBitmap;
  try {
    // L'orientation EXIF est appliquée par createImageBitmap
    image = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return { blob: file, width: 0, height: 0, placeholder: null };
  }
  const { width, height } = fitWithin(
    image.width,
    image.height,
    PHOTO_MAX_WIDTH,
    PHOTO_MAX_HEIGHT,
  );
  const original = { width: image.width, height: image.height };
  const placeholder = thumbHash(image);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")?.drawImage(image, 0, 0, width, height);
  image.close();
  const compressed = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.85),
  );
  // Safari ancien ne sait pas écrire du WebP : il renvoie du PNG, souvent plus lourd
  const useCompressed =
    compressed?.type === "image/webp" && compressed.size < file.size;
  return {
    blob: useCompressed ? compressed : file,
    // Les dimensions de la photo envoyée : la version réduite, ou l'originale
    width: useCompressed ? width : original.width,
    height: useCompressed ? height : original.height,
    placeholder,
  };
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
