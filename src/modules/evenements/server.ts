import "server-only";
import { horlogeSysteme } from "@/shared/lib/horloge";
import * as cas from "./application/cas-usage";
import type { Auteur, DepsEvenements } from "./application/cas-usage";
import type { Autorisation } from "./application/ports";
import type { EvenementAffiche, PageResumee } from "./domain/affichage";
import {
  type Evenement,
  type Filtres,
  type FormulaireEvenement,
  periodeDe,
} from "./domain/evenement";
import { depotEvenementsJson } from "./infrastructure/depot-json";

export type { Auteur, Autorisation };

const deps: DepsEvenements = {
  evenements: depotEvenementsJson,
  horloge: horlogeSysteme,
};

export const listerEvenements = (filtres: Filtres, depuis = 0) =>
  cas.lister(deps, filtres, depuis);
export const evenementParId = (id: string) => cas.parId(deps, id);
export const evenementsDeLaPage = (pageId: string) =>
  cas.deLaPage(deps, pageId);
export const idsPagesAvecEvenements = () => cas.pagesAvecEvenements(deps);
export const tousLesEvenements = () => deps.evenements.tous();

export const creerEvenement = (
  auteur: Auteur,
  autorise: Autorisation,
  formulaire: FormulaireEvenement,
  photo: string | null,
) => cas.creer(deps, auteur, autorise, formulaire, photo);

export const modifierEvenement = (
  auteur: Auteur,
  autorise: Autorisation,
  id: string,
  formulaire: FormulaireEvenement,
  photo: string | null | undefined,
) => cas.modifier(deps, auteur, autorise, id, formulaire, photo);

export const annulerEvenement = (
  auteur: Auteur,
  autorise: Autorisation,
  id: string,
  motif: string,
) => cas.annuler(deps, auteur, autorise, id, motif);

/**
 * Joint la période calculée (UTC) et la page organisatrice, fournie par
 * l'appelant à partir du module pages.
 */
export function afficher(
  evenements: readonly Evenement[],
  pages: ReadonlyMap<string, PageResumee>,
): EvenementAffiche[] {
  const maintenant = deps.horloge.maintenant();
  return evenements.map((e) => ({
    ...e,
    periode: periodeDe(e, maintenant),
    page: pages.get(e.pageId) ?? {
      id: e.pageId,
      nom: "—",
      slug: "",
      photo: null,
    },
  }));
}
