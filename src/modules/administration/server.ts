import "server-only";
import * as sup from "./application/supervision";
import type { SourcesSupervision } from "./application/supervision";

export type { LignePage, SourcesSupervision } from "./application/supervision";

/**
 * Lectures de l'espace Administration (US-07), en lecture seule. Les sources
 * viennent des autres modules, branchées par la route qui compose l'écran.
 */
export const listerComptes = (s: SourcesSupervision, q: string, page: number) =>
  sup.listerComptes(s, q, page);
export const listerPages = (s: SourcesSupervision, q: string, page: number) =>
  sup.listerPages(s, q, page);
export const listerEvenements = (
  s: SourcesSupervision,
  q: string,
  page: number,
) => sup.listerEvenements(s, q, page);
