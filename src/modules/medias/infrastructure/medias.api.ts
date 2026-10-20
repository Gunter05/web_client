import "server-only";
import { api, ApiError } from "@/shared/api/client";

/** Où et comment le navigateur envoie le fichier (réponse de l'API). */
export type DirectUpload = {
  id: string;
  uploadUrl: string;
  headers: Record<string, string>;
  expiresAt: string;
};

/**
 * Réserve un envoi direct du navigateur vers le stockage (ADR 0014 du
 * backend). Renvoie `null` quand le stockage ne le permet pas (disque) : la
 * photo passe alors par l'API.
 */
export async function reserveDirectUpload(
  type: string,
  size: number,
): Promise<DirectUpload | null> {
  try {
    return await api<DirectUpload>("/api/v1/medias/uploads", {
      body: { type, size },
    });
  } catch (error) {
    if (error instanceof ApiError && error.code === "directUploadUnavailable") {
      return null;
    }
    throw error;
  }
}

/** Fait vérifier le fichier envoyé par le navigateur ; renvoie son adresse. */
export async function confirmDirectUpload(id: string): Promise<string> {
  const { url } = await api<{ url: string }>(
    `/api/v1/medias/${encodeURIComponent(id)}/confirmation`,
    { method: "POST" },
  );
  return url;
}

/** Envoi par l'API (stockage sur disque) : le fichier passe par le serveur. */
export async function uploadThroughApi(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const { url } = await api<{ url: string }>("/api/v1/medias", { form });
  return url;
}
