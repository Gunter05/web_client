export const TYPES_ORGANISATION = [
  "club",
  "association",
  "bde",
  "service",
  "autre",
] as const;
export type TypeOrganisation = (typeof TYPES_ORGANISATION)[number];

export type Page = {
  id: string;
  /** Fixé à la création : la page n'est pas modifiable en V1. */
  slug: string;
  nom: string;
  description: string;
  type: TypeOrganisation;
  photo: string | null;
  creeLe: string;
};

export type Role = "proprietaire" | "contributeur";

export type Membre = {
  pageId: string;
  compteId: string;
  role: Role;
  ajouteLe: string;
};

export type StatutDemande = "en_attente" | "acceptee" | "refusee" | "retiree";

export type DemandePage = {
  id: string;
  demandeurId: string;
  nom: string;
  description: string;
  type: TypeOrganisation;
  photo: string | null;
  justification: string;
  statut: StatutDemande;
  motifRefus: string | null;
  envoyeeLe: string;
  traiteeLe: string | null;
  traiteePar: string | null;
  pageId: string | null;
};

export type FormulaireDemande = {
  nom: string;
  description: string;
  type: string;
  justification: string;
};

export type ErreursChamps = Record<string, string>;

/** US-03 : règles du formulaire « Créer une page ». */
export function erreursDemande(f: FormulaireDemande): ErreursChamps {
  const champs: ErreursChamps = {};
  const nom = f.nom.trim();
  const description = f.description.trim();
  const justification = f.justification.trim();
  if (!nom) champs.nom = "obligatoire";
  else if (nom.length < 3 || nom.length > 60) champs.nom = "longueurNomPage";
  if (!description) champs.description = "obligatoire";
  else if (description.length > 500) champs.description = "max500";
  if (!estTypeOrganisation(f.type)) champs.type = "obligatoire";
  if (!justification) champs.justification = "obligatoire";
  else if (justification.length > 500) champs.justification = "max500";
  return champs;
}

export function estTypeOrganisation(type: string): type is TypeOrganisation {
  return (TYPES_ORGANISATION as readonly string[]).includes(type);
}

/** Deux noms de page sont identiques sans tenir compte de la casse ni des accents. */
export function cleDeNom(nom: string): string {
  return nom
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export const MOTIF_MIN = 10;

/** Propriétaire d'abord, puis contributeurs du plus récent au plus ancien (US-06). */
export function trierMembres(membres: readonly Membre[]): Membre[] {
  return [...membres].sort((a, b) => {
    if (a.role !== b.role) return a.role === "proprietaire" ? -1 : 1;
    return b.ajouteLe.localeCompare(a.ajouteLe);
  });
}
