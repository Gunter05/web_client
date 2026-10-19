/** Toutes les dates du domaine sont des instants UTC (D7). */
export type Clock = { now(): Date };

export const systemClock: Clock = { now: () => new Date() };

/** Jour UTC au format AAAA-MM-JJ. */
export function utcDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}
