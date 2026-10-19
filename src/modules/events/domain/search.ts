/** Longueur maximale d'une recherche, pour borner le travail du serveur. */
export const SEARCH_MAX_LENGTH = 100;

/** Minuscules, sans accents ni espaces superflus. */
function normalize(text: string): string {
  return text
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
export function matchesSearch(
  texts: readonly (string | null)[],
  search: string,
): boolean {
  const words = normalize(search.slice(0, SEARCH_MAX_LENGTH))
    .split(" ")
    .filter(Boolean);
  if (!words.length) return true;
  const content = normalize(texts.filter(Boolean).join(" "));
  return words.every((word) => content.includes(word));
}
