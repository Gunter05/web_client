/** Toutes les dates du domaine sont des instants UTC (D7). */
export type Horloge = { maintenant(): Date };

export const horlogeSysteme: Horloge = { maintenant: () => new Date() };

/** Jour UTC au format AAAA-MM-JJ. */
export function jourUtc(date: Date): string {
  return date.toISOString().slice(0, 10);
}
