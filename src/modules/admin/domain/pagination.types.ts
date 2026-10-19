/** Tranche d'une liste de l'espace Administration, paginée par 25 par l'API (US-07). */
export type PaginatedResult<T> = {
  elements: T[];
  page: number;
  totalPages: number;
  total: number;
};
