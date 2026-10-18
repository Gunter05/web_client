import "server-only";
import { cache } from "react";
import { TAILLE_PAGE } from "./domain/evenement";
import type { FiltresUrl } from "./domain/filtres-url";
import {
  apiEvenements,
  type DonneesEnvoyees,
} from "./infrastructure/api-evenements";

export type {
  DonneesEnvoyees,
  ListeEvenements,
} from "./infrastructure/api-evenements";

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
    p.set("categorie", filtres.categories.join(","));
  if (filtres.periodes.length) p.set("periode", filtres.periodes.join(","));
  if (filtres.pages.length) p.set("page", filtres.pages.join(","));
  if (filtres.recherche) p.set("q", filtres.recherche);
  p.set("depuis", String(depuis));
  p.set("limite", String(limite));
  return apiEvenements.lister(p);
}

export const evenementParId = cache((id: string) => apiEvenements.fiche(id));
export const evenementsDeLaPage = cache((slug: string) =>
  apiEvenements.deLaPage(slug),
);

// ——— Écriture au nom de la page active (US-11, US-15) ———
export const creerEvenement = (pageId: string, d: DonneesEnvoyees) =>
  apiEvenements.creer(pageId, d);
export const modifierEvenement = (
  pageId: string,
  id: string,
  d: DonneesEnvoyees,
) => apiEvenements.modifier(pageId, id, d);
export const annulerEvenement = (pageId: string, id: string, motif: string) =>
  apiEvenements.annuler(pageId, id, motif);
