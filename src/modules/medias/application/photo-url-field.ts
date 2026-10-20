import { z } from "zod";
import { MEDIA_URL_PATTERN } from "@/modules/medias/domain/photo";

/**
 * Champ `photoUrl` d'un formulaire : vide (aucune nouvelle photo) ou adresse
 * d'un média déjà envoyé par `usePhotoUpload`. L'API revérifie que le média
 * existe et qu'il est prêt.
 */
export const photoUrlField = z.preprocess(
  (value) => (value === "" || value === undefined ? null : value),
  z.string().regex(MEDIA_URL_PATTERN).nullable(),
);
