import { translateApiError } from "@/shared/api/client";

/**
 * Codes d'erreur du module `pages` de l'API qui n'ont pas de clé `errors.*`
 * du même nom : leur message dépend du contexte (limites propres aux pages).
 */
const ERROR_CODES: Record<string, string> = {
  nameLength: "pageNameLength",
  descriptionTooLong: "maxLength500",
  justificationTooLong: "maxLength500",
  pageRequestNotFound: "notFound",
  pageNotFound: "notFound",
  memberNotFound: "notFound",
  accountNotFound: "notFound",
};

/** Champs de l'API dont le nom diffère de celui du formulaire. */
const FIELDS: Record<string, string> = { photoUrl: "photo" };

/** Exécute un appel à l'API en traduisant ses erreurs en clés du front. */
export async function withTranslatedErrors<T>(
  call: () => Promise<T>,
): Promise<T> {
  try {
    return await call();
  } catch (error) {
    throw translateApiError(error, ERROR_CODES, FIELDS);
  }
}
