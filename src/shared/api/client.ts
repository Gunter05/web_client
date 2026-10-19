import "server-only";
import { env } from "@/shared/config/env";
import { readToken } from "@/shared/api/token";

/**
 * Erreur renvoyée par l'API (ProblemDetail, ADR 0005 du backend). `code` est
 * la clé de traduction (`erreurs.*`), `champs` les erreurs par champ.
 */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    readonly fieldErrors?: Record<string, string>,
  ) {
    super(code);
  }
}

type Options = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  form?: FormData;
  /** Requête anonyme même si un jeton existe (ex. connexion). */
  anonymous?: boolean;
};

function defaultCode(status: number): string {
  if (status === 401) return "loginRequired";
  if (status === 403) return "accessDenied";
  if (status === 404) return "notFound";
  if (status === 400) return "invalidInput";
  return "unknown";
}

/**
 * Appel de l'API depuis le serveur Next.js (BFF, ADR 0003) : le navigateur ne
 * l'appelle jamais. Le jeton de session est joint automatiquement.
 */
export async function api<T>(path: string, options: Options = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  const token = options.anonymous ? undefined : await readToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  let body: BodyInit | undefined;
  if (options.form) body = options.form;
  else if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }
  const response = await fetch(`${env.API_URL}${path}`, {
    method: options.method ?? (body ? "POST" : "GET"),
    headers,
    body,
    cache: "no-store",
  });
  if (response.status === 204) return undefined as T;
  const content = await response.text();
  const formData: unknown = content ? JSON.parse(content) : undefined;
  if (!response.ok) {
    const problem = (formData ?? {}) as {
      code?: string;
      champs?: Record<string, string>;
      /** Nom des erreurs par champ dans les modules au contrat anglais. */
      fieldErrors?: Record<string, string>;
    };
    throw new ApiError(
      response.status,
      englishCode(problem.code ?? defaultCode(response.status)),
      englishFieldErrors(problem.champs ?? problem.fieldErrors),
    );
  }
  return formData as T;
}

/**
 * Codes d'erreur des modules de l'API encore en français (comptes, médias,
 * administration, audience) → clés `errors.*` du front. Les modules passés
 * en anglais (events, pages) renvoient déjà des codes anglais.
 */
const FRENCH_ERROR_CODES: Record<string, string> = {
  obligatoire: "required",
  longueur: "accountNameLength",
  emailInvalide: "invalidEmail",
  emailDejaUtilise: "emailTaken",
  motDePasseCourt: "passwordTooShort",
  identifiantsInvalides: "invalidCredentials",
  formatImage: "invalidPhoto",
  tailleImage: "photoTooLarge",
  formulaireInvalide: "invalidInput",
  accesRefuse: "accessDenied",
  connexionRequise: "loginRequired",
  introuvable: "notFound",
  pageIntrouvable: "notFound",
  evenementIntrouvable: "eventNotFound",
};

/** Noms de champs des modules encore en français → noms des champs du formulaire. */
const FRENCH_FIELDS: Record<string, string> = {
  nom: "name",
  motDePasse: "password",
};

const englishCode = (code: string) => FRENCH_ERROR_CODES[code] ?? code;

function englishFieldErrors(fields: Record<string, string> | undefined) {
  if (!fields) return undefined;
  return Object.fromEntries(
    Object.entries(fields).map(([field, code]) => [
      FRENCH_FIELDS[field] ?? field,
      englishCode(code),
    ]),
  );
}

/** Variante qui renvoie `null` quand la ressource n'existe pas (404). */
export async function apiOrNull<T>(
  path: string,
  options: Options = {},
): Promise<T | null> {
  try {
    return await api<T>(path, options);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/** Téléverse une image vers l'API (ADR 0010 du backend) et renvoie son adresse. */
export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("fichier", file);
  const { url } = await api<{ url: string }>("/api/v1/medias", {
    form: form,
  });
  return url;
}

/**
 * Traduit une erreur d'un module de l'API au contrat anglais dans les codes
 * (`erreurs.*`) et noms de champs du front. Les autres erreurs passent telles
 * quelles.
 */
export function translateApiError(
  error: unknown,
  codes: Record<string, string>,
  fieldErrors: Record<string, string>,
): unknown {
  if (!(error instanceof ApiError)) return error;
  const translated = error.fieldErrors
    ? Object.fromEntries(
        Object.entries(error.fieldErrors).map(([field, code]) => [
          fieldErrors[field] ?? field,
          codes[code] ?? code,
        ]),
      )
    : undefined;
  return new ApiError(
    error.status,
    codes[error.code] ?? error.code,
    translated,
  );
}
