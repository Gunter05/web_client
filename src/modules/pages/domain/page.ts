export const TYPES_ORGANISATION = [
  "club",
  "association",
  "bde",
  "service",
  "autre",
] as const;
export type TypeOrganisation = (typeof TYPES_ORGANISATION)[number];

/** Organisation qui publie. Créée seulement après validation d'un admin (US-03). */
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

/**
 * Page dont le compte connecté est membre, avec son rôle (US-06). On publie
 * toujours au nom d'une de ces pages ; aucun « profil actif » n'est mémorisé.
 */
export type PageDuMembre = Pick<Page, "id" | "slug" | "nom" | "photo"> & {
  role: Role;
};

/** Membre d'une page, avec son profil public (US-06). */
export type Membre = {
  compteId: string;
  nom: string;
  photo: string | null;
  role: Role;
  ajouteLe: string;
};

export type StatutDemande = "en_attente" | "acceptee" | "refusee" | "retiree";

export type DemandePage = {
  id: string;
  nom: string;
  description: string;
  type: TypeOrganisation;
  photo: string | null;
  justification: string;
  statut: StatutDemande;
  motifRefus: string | null;
  envoyeeLe: string;
  /** Renseigné dans l'espace Administration. */
  demandeur: { id: string; nom: string; photo: string | null } | null;
};

export type FormulaireDemande = {
  nom: string;
  description: string;
  type: string;
  justification: string;
  photo: string | null;
};
