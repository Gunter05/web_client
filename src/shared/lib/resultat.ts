/**
 * Résultat d'un cas d'usage : succès avec une valeur, ou échec avec un code
 * d'erreur traduisible (clé du catalogue `erreurs.*`) et, pour les formulaires,
 * les erreurs par champ.
 */
export type ErreursChamps = Record<string, string>;

export type Echec = {
  ok: false;
  code: string;
  params?: Record<string, string | number>;
  champs?: ErreursChamps;
};

export type Resultat<T = void> = { ok: true; valeur: T } | Echec;

export function succes<T>(valeur: T): Resultat<T>;
export function succes(): Resultat<void>;
export function succes<T>(valeur?: T): Resultat<T | undefined> {
  return { ok: true, valeur };
}

export function echec(
  code: string,
  params?: Record<string, string | number>,
): Echec {
  return params ? { ok: false, code, params } : { ok: false, code };
}

export function echecChamps(champs: ErreursChamps): Echec {
  return { ok: false, code: "formulaireInvalide", champs };
}
