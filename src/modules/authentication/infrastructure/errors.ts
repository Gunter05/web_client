import { translateApiError } from "@/shared/api/client";

/** Codes du module `authentication` de l'API sans clé `errors.*` du même nom. */
const ERROR_CODES: Record<string, string> = {
  displayNameLength: "accountNameLength",
};

/** Champs de l'API dont le nom diffère de celui du formulaire. */
const FIELDS: Record<string, string> = { displayName: "name" };

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
