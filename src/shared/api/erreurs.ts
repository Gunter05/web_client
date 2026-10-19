import "server-only";
import { ErreurApi } from "@/shared/api/client";
import { type EtatFormulaire, etatDepuisEchec } from "@/shared/lib/formulaire";

/**
 * Exécute un appel à l'API et traduit son refus (règle métier, droit,
 * validation) en état de formulaire. Toute autre erreur remonte telle quelle.
 */
export async function sansErreurApi<T>(
  appel: () => Promise<T>,
): Promise<{ ok: true; valeur: T } | { ok: false; etat: EtatFormulaire }> {
  try {
    return { ok: true, valeur: await appel() };
  } catch (erreur) {
    if (erreur instanceof ErreurApi) {
      return { ok: false, etat: etatDepuisEchec(erreur) };
    }
    throw erreur;
  }
}

/** Variante pour les actions sans formulaire : renvoie seulement le code. */
export async function codeErreurApi(
  appel: () => Promise<unknown>,
): Promise<string | undefined> {
  const resultat = await sansErreurApi(appel);
  return resultat.ok ? undefined : resultat.etat.erreur;
}
