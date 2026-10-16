import "server-only";
import type { SourcesSupervision } from "@/modules/administration/server";
import { tousLesEvenements } from "@/modules/evenements/server";
import { tousLesComptes } from "@/modules/identite/server";
import { tousLesMembres, toutesLesPages } from "@/modules/pages/server";

/** Branche les données des modules sur les lectures de supervision. */
export const sourcesSupervision: SourcesSupervision = {
  comptes: () =>
    tousLesComptes().map(({ id, nom, email, creeLe }) => ({
      id,
      nom,
      email,
      creeLe,
    })),
  pages: toutesLesPages,
  membres: tousLesMembres,
  evenements: tousLesEvenements,
};

export function lireRecherche(
  params: Record<string, string | string[] | undefined>,
) {
  const q = typeof params.q === "string" ? params.q.slice(0, 100) : "";
  const page = Number(typeof params.page === "string" ? params.page : 1) || 1;
  return { q, page };
}
