/** Toutes les listes de l'espace Administration sont paginées par 25 (US-07). */
export const TAILLE_PAGE_ADMIN = 25;

export type PageDeResultats<T> = {
  elements: T[];
  page: number;
  totalPages: number;
  total: number;
};

export function paginer<T>(
  elements: readonly T[],
  page: number,
): PageDeResultats<T> {
  const totalPages = Math.max(
    1,
    Math.ceil(elements.length / TAILLE_PAGE_ADMIN),
  );
  const courante = Math.min(Math.max(1, Math.floor(page) || 1), totalPages);
  const debut = (courante - 1) * TAILLE_PAGE_ADMIN;
  return {
    elements: elements.slice(debut, debut + TAILLE_PAGE_ADMIN),
    page: courante,
    totalPages,
    total: elements.length,
  };
}

export function contient(texte: string, recherche: string): boolean {
  return texte.toLowerCase().includes(recherche.trim().toLowerCase());
}
