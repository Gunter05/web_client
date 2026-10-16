import type { Horloge } from "@/shared/lib/horloge";
import {
  echec,
  echecChamps,
  type Resultat,
  succes,
} from "@/shared/lib/resultat";
import { nouvelId, slugifier } from "@/shared/lib/texte";
import {
  cleDeNom,
  type DemandePage,
  erreursDemande,
  type FormulaireDemande,
  type Membre,
  MOTIF_MIN,
  type Page,
  type Role,
  trierMembres,
  type TypeOrganisation,
} from "../domain/page";
import type { DepotDemandes, DepotMembres, DepotPages } from "./ports";

export type DepsPages = {
  pages: DepotPages;
  membres: DepotMembres;
  demandes: DepotDemandes;
  horloge: Horloge;
};

export type Acteur = { compteId: string; estAdmin: boolean };

const maintenant = (deps: DepsPages) => deps.horloge.maintenant().toISOString();

// ——— Lectures ———

export function roleDe(
  deps: DepsPages,
  pageId: string,
  compteId: string,
): Role | null {
  return (
    deps.membres
      .tous()
      .find((m) => m.pageId === pageId && m.compteId === compteId)?.role ?? null
  );
}

export function pagesDuMembre(
  deps: DepsPages,
  compteId: string,
): (Page & { role: Role })[] {
  const roles = new Map(
    deps.membres
      .tous()
      .filter((m) => m.compteId === compteId)
      .map((m) => [m.pageId, m.role]),
  );
  return deps.pages
    .toutes()
    .flatMap((p) => {
      const role = roles.get(p.id);
      return role ? [{ ...p, role }] : [];
    })
    .sort((a, b) => a.nom.localeCompare(b.nom));
}

export function membresDe(deps: DepsPages, pageId: string): Membre[] {
  return trierMembres(deps.membres.tous().filter((m) => m.pageId === pageId));
}

export function demandeEnAttenteDe(
  deps: DepsPages,
  compteId: string,
): DemandePage | null {
  return (
    deps.demandes
      .toutes()
      .find((d) => d.demandeurId === compteId && d.statut === "en_attente") ??
    null
  );
}

export function derniereDemandeDe(
  deps: DepsPages,
  compteId: string,
): DemandePage | null {
  return (
    deps.demandes
      .toutes()
      .filter((d) => d.demandeurId === compteId)
      .sort((a, b) => b.envoyeeLe.localeCompare(a.envoyeeLe))[0] ?? null
  );
}

/** Demandes en attente, de la plus ancienne à la plus récente (US-03). */
export function demandesEnAttente(deps: DepsPages): DemandePage[] {
  return deps.demandes
    .toutes()
    .filter((d) => d.statut === "en_attente")
    .sort((a, b) => a.envoyeeLe.localeCompare(b.envoyeeLe));
}

// ——— Demande de page (US-03) ———

function nomDejaUtilise(deps: DepsPages, nom: string): boolean {
  const cle = cleDeNom(nom);
  return (
    deps.pages.toutes().some((p) => cleDeNom(p.nom) === cle) ||
    deps.demandes
      .toutes()
      .some((d) => d.statut === "en_attente" && cleDeNom(d.nom) === cle)
  );
}

export function deposerDemande(
  deps: DepsPages,
  demandeurId: string,
  formulaire: FormulaireDemande,
  photo: string | null,
): Resultat<DemandePage> {
  if (demandeEnAttenteDe(deps, demandeurId)) {
    return echec("demandeDejaEnAttente");
  }
  // Chaque champ en erreur est signalé, doublon de nom compris.
  const champs = erreursDemande(formulaire);
  if (!champs.nom && nomDejaUtilise(deps, formulaire.nom)) {
    champs.nom = "nomDejaUtilise";
  }
  if (Object.keys(champs).length) return echecChamps(champs);
  const demande: DemandePage = {
    id: nouvelId(),
    demandeurId,
    nom: formulaire.nom.trim(),
    description: formulaire.description.trim(),
    type: formulaire.type as TypeOrganisation,
    justification: formulaire.justification.trim(),
    photo,
    statut: "en_attente",
    motifRefus: null,
    envoyeeLe: maintenant(deps),
    traiteeLe: null,
    traiteePar: null,
    pageId: null,
  };
  deps.demandes.ajouter(demande);
  return succes(demande);
}

export function retirerDemande(
  deps: DepsPages,
  demandeurId: string,
  demandeId: string,
): Resultat {
  const demande = deps.demandes.toutes().find((d) => d.id === demandeId);
  if (!demande || demande.demandeurId !== demandeurId) {
    return echec("introuvable");
  }
  if (demande.statut !== "en_attente") return echec("demandeDejaTraitee");
  deps.demandes.modifier({
    ...demande,
    statut: "retiree",
    traiteeLe: maintenant(deps),
  });
  return succes();
}

function demandeATraiter(
  deps: DepsPages,
  acteur: Acteur,
  demandeId: string,
): Resultat<DemandePage> {
  if (!acteur.estAdmin) return echec("accesRefuse");
  const demande = deps.demandes.toutes().find((d) => d.id === demandeId);
  if (!demande) return echec("introuvable");
  if (demande.statut !== "en_attente") return echec("demandeDejaTraitee");
  return succes(demande);
}

function slugLibre(deps: DepsPages, nom: string): string {
  const base = slugifier(nom) || "page";
  const pris = new Set(deps.pages.toutes().map((p) => p.slug));
  let slug = base;
  for (let i = 2; pris.has(slug); i++) slug = `${base}-${i}`;
  return slug;
}

/** Acceptée : la page est créée et le demandeur en devient propriétaire. */
export function accepterDemande(
  deps: DepsPages,
  acteur: Acteur,
  demandeId: string,
): Resultat<{ page: Page; demande: DemandePage }> {
  const trouvee = demandeATraiter(deps, acteur, demandeId);
  if (!trouvee.ok) return trouvee;
  const demande = trouvee.valeur;
  const le = maintenant(deps);
  const page: Page = {
    id: nouvelId(),
    slug: slugLibre(deps, demande.nom),
    nom: demande.nom,
    description: demande.description,
    type: demande.type,
    photo: demande.photo,
    creeLe: le,
  };
  deps.pages.ajouter(page);
  deps.membres.ajouter({
    pageId: page.id,
    compteId: demande.demandeurId,
    role: "proprietaire",
    ajouteLe: le,
  });
  const traitee: DemandePage = {
    ...demande,
    statut: "acceptee",
    traiteeLe: le,
    traiteePar: acteur.compteId,
    pageId: page.id,
  };
  deps.demandes.modifier(traitee);
  return succes({ page, demande: traitee });
}

export function refuserDemande(
  deps: DepsPages,
  acteur: Acteur,
  demandeId: string,
  motif: string,
): Resultat<DemandePage> {
  const trouvee = demandeATraiter(deps, acteur, demandeId);
  if (!trouvee.ok) return trouvee;
  const motifPropre = motif.trim();
  if (motifPropre.length < MOTIF_MIN)
    return echecChamps({ motif: "motifCourt" });
  const traitee: DemandePage = {
    ...trouvee.valeur,
    statut: "refusee",
    motifRefus: motifPropre,
    traiteeLe: maintenant(deps),
    traiteePar: acteur.compteId,
  };
  deps.demandes.modifier(traitee);
  return succes(traitee);
}

// ——— Accès à une page (US-06) ———

function pageDuProprietaire(
  deps: DepsPages,
  proprietaireId: string,
  pageId: string,
): Resultat<Page> {
  const page = deps.pages.toutes().find((p) => p.id === pageId);
  if (!page) return echec("introuvable");
  if (roleDe(deps, pageId, proprietaireId) !== "proprietaire") {
    return echec("accesRefuse");
  }
  return succes(page);
}

export function donnerAcces(
  deps: DepsPages,
  proprietaireId: string,
  pageId: string,
  compteId: string,
): Resultat<Page> {
  const trouvee = pageDuProprietaire(deps, proprietaireId, pageId);
  if (!trouvee.ok) return trouvee;
  if (compteId === proprietaireId || roleDe(deps, pageId, compteId)) {
    return echec("dejaMembre");
  }
  deps.membres.ajouter({
    pageId,
    compteId,
    role: "contributeur",
    ajouteLe: maintenant(deps),
  });
  return succes(trouvee.valeur);
}

export function retirerAcces(
  deps: DepsPages,
  proprietaireId: string,
  pageId: string,
  compteId: string,
): Resultat<Page> {
  const trouvee = pageDuProprietaire(deps, proprietaireId, pageId);
  if (!trouvee.ok) return trouvee;
  if (roleDe(deps, pageId, compteId) !== "contributeur") {
    return echec("introuvable");
  }
  deps.membres.retirer(pageId, compteId);
  return succes(trouvee.valeur);
}
