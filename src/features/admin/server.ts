import "server-only";
import { apiAdministration } from "@/features/admin/api/administration.api";

export { adminCourant } from "@/features/admin/api/garde";

export type {
  CompteAdmin,
  DetailPageAdmin,
  EvenementAdmin,
  MembreAdmin,
  PageAdmin,
} from "@/features/admin/types/supervision.types";

/** Supervision (US-07) : le rôle admin est vérifié par l'API à chaque appel. */
export const listerComptes = apiAdministration.comptes;
export const listerPages = apiAdministration.pages;
export const detailPage = apiAdministration.page;
export const listerEvenements = apiAdministration.evenements;
