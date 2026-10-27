import { clientEnv } from "@/shared/config/env.client";

// Adresse d'une photo telle que l'API la donne : /api/v1/medias/{uuid}
const MEDIA_PATH = /^\/api\/v1\/medias\/([0-9a-f-]{36})$/;

/**
 * Adresse à afficher pour une photo. Une photo de l'API est lue directement
 * dans le bucket (`<adresse publique>/medias/{id}`, ADR 0014 du backend) au
 * lieu de faire navigateur → site → API → redirection → stockage. Les autres
 * adresses (photos publiques, aperçus locaux) restent telles quelles.
 */
export function mediaSrc(
  url: string,
  publicBase = clientEnv.NEXT_PUBLIC_MEDIAS_PUBLIC_URL,
): string {
  const id = MEDIA_PATH.exec(url)?.[1];
  if (!id || !publicBase) return url;
  return `${publicBase.replace(/\/+$/, "")}/medias/${id}`;
}
