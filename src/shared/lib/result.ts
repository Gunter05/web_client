/**
 * Résultat d'un cas d'usage : succès avec une valeur, ou échec avec un code
 * d'erreur traduisible (clé du catalogue `erreurs.*`) et, pour les formulaires,
 * les erreurs par champ.
 */
export type FieldErrors = Record<string, string>;

export type Failure = {
  ok: false;
  code: string;
  params?: Record<string, string | number>;
  fieldErrors?: FieldErrors;
};

export type Result<T = void> = { ok: true; value: T } | Failure;

export function success<T>(value: T): Result<T>;
export function success(): Result<void>;
export function success<T>(value?: T): Result<T | undefined> {
  return { ok: true, value };
}

export function failure(
  code: string,
  params?: Record<string, string | number>,
): Failure {
  return params ? { ok: false, code, params } : { ok: false, code };
}

export function fieldFailure(fieldErrors: FieldErrors): Failure {
  return { ok: false, code: "invalidInput", fieldErrors };
}
