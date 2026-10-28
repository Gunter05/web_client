import { clientEnv } from "@/shared/config/env.client";

const MEDIA_PATH = /^\/api\/v1\/medias\/([0-9a-f-]{36})$/;

/**
 * Adresse d'affichage d'une image. Une photo de l'API (/api/v1/medias/:id)
 * est lue directement dans le stockage public, sous la clé `medias/{id}`
 * (S3FileStorage du backend), sans passer par Vercel ni par l'API. Les
 * autres adresses restent inchangées.
 */
export function mediaSrc(
  src: string,
  mediaUrl: string = clientEnv.NEXT_PUBLIC_MEDIA_URL,
): string {
  const id = MEDIA_PATH.exec(src)?.[1];
  if (!mediaUrl || !id) return src;
  return `${mediaUrl.replace(/\/+$/, "")}/medias/${id}`;
}
