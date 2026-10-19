import "server-only";
import { apiEvenements } from "@/features/events/api/evenements.api";
import {
  categorieVersApi,
  periodeVersApi,
} from "@/features/events/api/traduction-api";
import { TAILLE_PAGE } from "@/features/events/lib/evenement";
import type { FiltresUrl } from "@/features/events/lib/filtres-url";

/**
 * Liste publique (US-01, US-16, US-17) : filtres repris de l'adresse (pages
 * désignées par leur slug), recherche texte, tranche de 20 à partir de `depuis`.
 */
export function listerEvenements(
  filtres: FiltresUrl & { recherche?: string },
  depuis = 0,
  limite = TAILLE_PAGE,
) {
  const p = new URLSearchParams();
  if (filtres.categories.length)
    p.set("category", filtres.categories.map(categorieVersApi).join(","));
  if (filtres.periodes.length)
    p.set("period", filtres.periodes.map(periodeVersApi).join(","));
  if (filtres.pages.length) p.set("page", filtres.pages.join(","));
  if (filtres.recherche) p.set("q", filtres.recherche);
  p.set("offset", String(depuis));
  p.set("limit", String(limite));
  return apiEvenements.lister(p);
}
