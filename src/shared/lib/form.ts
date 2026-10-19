import { z } from "zod";

/** État renvoyé par les Server Actions de formulaire à l'interface. */
export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

/** Convertit une erreur de l'API (ou de validation) en état de formulaire. */
export function stateFromFailure(failure: {
  code: string;
  fieldErrors?: Record<string, string>;
}): FormState {
  return failure.fieldErrors
    ? { fieldErrors: failure.fieldErrors, error: failure.code }
    : { error: failure.code };
}

/**
 * Lecture typée d'un FormData : toute Server Action est un endpoint public
 * (ADR 0008), ses entrées passent donc par Zod avant d'atteindre le domaine.
 * Les règles métier (longueurs, dates…) restent dans les modules.
 */
export function parseForm<T extends z.ZodRawShape>(
  shape: T,
  formData: FormData,
): z.infer<z.ZodObject<T>> | null {
  const raw: Record<string, unknown> = {};
  for (const key of Object.keys(shape)) {
    const values = formData.getAll(key);
    raw[key] = shape[key] instanceof z.ZodArray ? values : values[0];
  }
  const result = z.object(shape).safeParse(raw);
  return result.success ? result.data : null;
}

/** Texte de formulaire : chaîne bornée, absente = chaîne vide. */
export const textField = (max = 5000) =>
  z.preprocess((v) => (typeof v === "string" ? v : ""), z.string().max(max));

/** Fichier facultatif : un input file vide envoie un File de taille 0. */
export const fileField = z.preprocess(
  (v) => (v instanceof File && v.size > 0 ? v : null),
  z.instanceof(File).nullable(),
);

export const idField = z.string().min(1).max(100);

/** Server Action de formulaire, fournie au module par la route qui le compose. */
export type FormAction = (
  state: FormState,
  formData: FormData,
) => Promise<FormState>;
