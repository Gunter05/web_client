import "server-only";
import { apiAdministration } from "./infrastructure/api-administration";

export type {
  CompteAdmin,
  DetailPageAdmin,
  EvenementAdmin,
  MembreAdmin,
  PageAdmin,
} from "./domain/supervision";

/** Supervision (US-07) : le rôle admin est vérifié par l'API à chaque appel. */
export const listerComptes = apiAdministration.comptes;
export const listerPages = apiAdministration.pages;
export const detailPage = apiAdministration.page;
export const listerEvenements = apiAdministration.evenements;
