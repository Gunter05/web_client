import "server-only";
import { cache } from "react";
import {
  apiEvenements,
  type DonneesEnvoyees,
} from "@/features/events/api/evenements.api";

export type {
  DonneesEnvoyees,
  ListeEvenements,
} from "@/features/events/api/evenements.api";
export { listerEvenements } from "@/features/events/api/liste";
export {
  listerDepuisUrl,
  pagesDuFiltre,
  rechercherEvenements,
} from "@/features/events/api/affichage";

export const evenementParId = cache((id: string) => apiEvenements.fiche(id));
export const evenementsDeLaPage = cache((slug: string) =>
  apiEvenements.deLaPage(slug),
);

// ——— Écriture au nom d'une page dont on est membre (US-11, US-15) ———
export const creerEvenement = (pageId: string, d: DonneesEnvoyees) =>
  apiEvenements.creer(pageId, d);
export const modifierEvenement = (
  pageId: string,
  id: string,
  d: DonneesEnvoyees,
) => apiEvenements.modifier(pageId, id, d);
export const annulerEvenement = (pageId: string, id: string, motif: string) =>
  apiEvenements.annuler(pageId, id, motif);
