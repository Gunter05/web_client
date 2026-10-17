import type { Horloge } from "@/shared/lib/horloge";
import {
  echec,
  echecChamps,
  type Resultat,
  succes,
} from "@/shared/lib/resultat";
import { idCourt } from "@/shared/lib/texte";
import {
  changementsSuivis,
  correspond,
  estModifiable,
  type Evenement,
  type Filtres,
  type FormulaireEvenement,
  MOTIF_ANNULATION_MIN,
  TAILLE_PAGE,
  trier,
  validerFormulaire,
} from "../domain/evenement";
import type { Autorisation, DepotEvenements } from "./ports";

export type DepsEvenements = { evenements: DepotEvenements; horloge: Horloge };

/** On agit toujours au nom de la page active (US-37). */
export type Auteur = { compteId: string; pageId: string | null };

// ——— Lectures ———

/** Tous les événements correspondant aux filtres, triés (US-16, US-17). */
export function listerTous(deps: DepsEvenements, filtres: Filtres) {
  const maintenant = deps.horloge.maintenant();
  return trier(
    deps.evenements.tous().filter((e) => correspond(e, filtres, maintenant)),
    maintenant,
  );
}

/** Liste paginée par 20 (US-16). */
export function lister(deps: DepsEvenements, filtres: Filtres, depuis = 0) {
  const tries = listerTous(deps, filtres);
  const fin = depuis + TAILLE_PAGE;
  return {
    evenements: tries.slice(depuis, fin),
    suivant: fin < tries.length ? fin : null,
  };
}

export function parId(deps: DepsEvenements, id: string): Evenement | null {
  return deps.evenements.tous().find((e) => e.id === id) ?? null;
}

/** Événements d'une page, du plus récent au plus ancien (US-39, page publique). */
export function deLaPage(deps: DepsEvenements, pageId: string): Evenement[] {
  return deps.evenements
    .tous()
    .filter((e) => e.pageId === pageId)
    .sort((a, b) => b.debut.localeCompare(a.debut));
}

/** Pages ayant au moins un événement (choix du filtre Page, US-17). */
export function pagesAvecEvenements(deps: DepsEvenements): string[] {
  return [...new Set(deps.evenements.tous().map((e) => e.pageId))];
}

// ——— Écritures : chaque droit est vérifié ici, côté serveur ———

function pageDeLAuteur(
  auteur: Auteur,
  autorise: Autorisation,
): Resultat<string> {
  if (!auteur.pageId) return echec("choisirPage");
  if (!autorise(auteur.pageId, auteur.compteId)) {
    return echec("pasAutorisePublier");
  }
  return succes(auteur.pageId);
}

function evenementDeLAuteur(
  deps: DepsEvenements,
  auteur: Auteur,
  autorise: Autorisation,
  id: string,
): Resultat<Evenement> {
  const page = pageDeLAuteur(auteur, autorise);
  if (!page.ok) return page;
  const evenement = parId(deps, id);
  if (!evenement) return echec("evenementIntrouvable");
  if (evenement.pageId !== page.valeur) return echec("pasAutorisePublier");
  if (!estModifiable(evenement, deps.horloge.maintenant())) {
    return echec("evenementNonModifiable");
  }
  return succes(evenement);
}

export function creer(
  deps: DepsEvenements,
  auteur: Auteur,
  autorise: Autorisation,
  formulaire: FormulaireEvenement,
  photo: string | null,
): Resultat<Evenement> {
  const page = pageDeLAuteur(auteur, autorise);
  if (!page.ok) return page;
  const maintenant = deps.horloge.maintenant();
  const valide = validerFormulaire(formulaire, maintenant);
  if (!valide.ok) return echecChamps(valide.champs);
  const le = maintenant.toISOString();
  const evenement: Evenement = {
    id: idCourt(),
    pageId: page.valeur,
    ...valide.donnees,
    photo,
    statut: "publie",
    derniereModification: null,
    annulation: null,
    creeLe: le,
    journal: [{ action: "creation", compteId: auteur.compteId, le }],
  };
  deps.evenements.ajouter(evenement);
  return succes(evenement);
}

export function modifier(
  deps: DepsEvenements,
  auteur: Auteur,
  autorise: Autorisation,
  id: string,
  formulaire: FormulaireEvenement,
  photo: string | null | undefined,
): Resultat<Evenement> {
  const trouve = evenementDeLAuteur(deps, auteur, autorise, id);
  if (!trouve.ok) return trouve;
  const avant = trouve.valeur;
  const maintenant = deps.horloge.maintenant();
  const valide = validerFormulaire(formulaire, maintenant, avant.debut);
  if (!valide.ok) return echecChamps(valide.champs);
  const le = maintenant.toISOString();
  const changements = changementsSuivis(avant, valide.donnees);
  const apres: Evenement = {
    ...avant,
    ...valide.donnees,
    photo: photo === undefined ? avant.photo : photo,
    statut: changements.length ? "modifie" : avant.statut,
    derniereModification: changements.length
      ? { le, changements }
      : avant.derniereModification,
    journal: [
      ...avant.journal,
      { action: "modification", compteId: auteur.compteId, le },
    ],
  };
  deps.evenements.modifier(apres);
  return succes(apres);
}

export function annuler(
  deps: DepsEvenements,
  auteur: Auteur,
  autorise: Autorisation,
  id: string,
  motif: string,
): Resultat<Evenement> {
  const trouve = evenementDeLAuteur(deps, auteur, autorise, id);
  if (!trouve.ok) return trouve;
  const motifPropre = motif.trim();
  if (motifPropre.length < MOTIF_ANNULATION_MIN) {
    return echecChamps({ motif: "motifCourt" });
  }
  const le = deps.horloge.maintenant().toISOString();
  const annule: Evenement = {
    ...trouve.valeur,
    statut: "annule",
    annulation: { motif: motifPropre, le },
    journal: [
      ...trouve.valeur.journal,
      { action: "annulation", compteId: auteur.compteId, le },
    ],
  };
  deps.evenements.modifier(annule);
  return succes(annule);
}
