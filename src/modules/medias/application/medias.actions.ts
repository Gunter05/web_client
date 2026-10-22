"use server";

import { z } from "zod";
import { catchApiError } from "@/shared/api/errors";
import { readToken } from "@/shared/api/token";
import { PHOTO_TYPES, checkPhoto } from "@/modules/medias/domain/photo";
import {
  confirmDirectUpload,
  type DirectUpload,
  reserveDirectUpload,
  uploadThroughApi,
} from "@/modules/medias/infrastructure/medias.api";

/** Résultat d'une étape d'envoi : la valeur, ou le code d'erreur à traduire. */
type Result<T> = { ok: true; value: T } | { ok: false; error: string };

const layoutShape = z
  .object({
    width: z.number().int().min(1).max(10_000),
    height: z.number().int().min(1).max(10_000),
    placeholder: z
      .string()
      .regex(/^[A-Za-z0-9+/]{8,64}={0,2}$/)
      .nullable(),
  })
  .nullable();

const announcement = z.object({
  type: z.enum(PHOTO_TYPES),
  size: z.number().int().positive(),
  layout: layoutShape,
});

/** Dimensions et aperçu flou annoncés avec une photo (ADR 0014 du backend). */
export type PhotoLayoutInput = z.infer<typeof layoutShape>;

/**
 * Étape 1 de l'envoi direct : réserve le média et renvoie l'adresse où le
 * navigateur envoie le fichier, ou `null` si le stockage ne le permet pas.
 */
export async function reservePhotoUploadAction(
  type: string,
  size: number,
  layout: PhotoLayoutInput,
): Promise<Result<DirectUpload | null>> {
  if (!(await readToken())) return { ok: false, error: "loginRequired" };
  const input = announcement.safeParse({ type, size, layout });
  if (!input.success) return { ok: false, error: "invalidPhoto" };
  const error = checkPhoto(input.data);
  if (error) return { ok: false, error };
  return unwrap(
    await catchApiError(() =>
      reserveDirectUpload(input.data.type, input.data.size, input.data.layout),
    ),
  );
}

/** Étape 3 de l'envoi direct : fait vérifier le fichier, renvoie son adresse. */
export async function confirmPhotoUploadAction(
  id: string,
): Promise<Result<string>> {
  if (!(await readToken())) return { ok: false, error: "loginRequired" };
  const mediaId = z.uuid().safeParse(id);
  if (!mediaId.success) return { ok: false, error: "invalidPhoto" };
  return unwrap(await catchApiError(() => confirmDirectUpload(mediaId.data)));
}

/** Envoi par l'API, quand le stockage n'accepte pas l'envoi direct. */
export async function uploadPhotoAction(
  formData: FormData,
): Promise<Result<string>> {
  if (!(await readToken())) return { ok: false, error: "loginRequired" };
  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "invalidPhoto" };
  const error = checkPhoto(file);
  if (error) return { ok: false, error };
  const layout = layoutShape.safeParse(layoutFromForm(formData));
  return unwrap(
    await catchApiError(() =>
      uploadThroughApi(file, layout.success ? layout.data : null),
    ),
  );
}

function unwrap<T>(
  result: Awaited<ReturnType<typeof catchApiError<T>>>,
): Result<T> {
  if (result.ok) return { ok: true, value: result.value };
  const { error, fieldErrors } = result.state;
  return { ok: false, error: fieldErrors?.photo ?? error ?? "unknown" };
}

function layoutFromForm(formData: FormData) {
  const width = Number(formData.get("width"));
  const height = Number(formData.get("height"));
  if (!width || !height) return null;
  const placeholder = formData.get("placeholder");
  return {
    width,
    height,
    placeholder: typeof placeholder === "string" ? placeholder : null,
  };
}
