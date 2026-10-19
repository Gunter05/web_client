import "server-only";
import { ApiError } from "@/shared/api/client";
import { type FormState, stateFromFailure } from "@/shared/lib/form";

/**
 * Exécute un appel à l'API et traduit son refus (règle métier, droit,
 * validation) en état de formulaire. Toute autre erreur remonte telle quelle.
 */
export async function catchApiError<T>(
  call: () => Promise<T>,
): Promise<{ ok: true; value: T } | { ok: false; state: FormState }> {
  try {
    return { ok: true, value: await call() };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, state: stateFromFailure(error) };
    }
    throw error;
  }
}

/** Variante pour les actions sans formulaire : renvoie seulement le code. */
export async function apiErrorCode(
  call: () => Promise<unknown>,
): Promise<string | undefined> {
  const result = await catchApiError(call);
  return result.ok ? undefined : result.state.error;
}
