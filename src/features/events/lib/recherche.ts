/** Longueur maximale d'une recherche, pour borner le travail du serveur. */
export const RECHERCHE_MAX = 100;

/** Minuscules, sans accents ni espaces superflus. */
function normaliser(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Un événement correspond si chaque mot recherché apparaît dans l'un de ses
 * textes (nom, lieu, description, page organisatrice), sans tenir compte
 * des accents ni de la casse. Une recherche vide correspond à tout.
 */
export function correspondRecherche(
  textes: readonly (string | null)[],
  recherche: string,
): boolean {
  const mots = normaliser(recherche.slice(0, RECHERCHE_MAX))
    .split(" ")
    .filter(Boolean);
  if (!mots.length) return true;
  const contenu = normaliser(textes.filter(Boolean).join(" "));
  return mots.every((mot) => contenu.includes(mot));
}
