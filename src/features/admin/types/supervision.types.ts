/** Lignes de l'espace Administration (US-07), telles que l'API les renvoie. */
export type CompteAdmin = {
  id: string;
  nom: string;
  email: string;
  creeLe: string;
};

export type PageAdmin = {
  id: string;
  slug: string;
  nom: string;
  /** Code d'un type d'organisation (catalogue `pages.types`). */
  type: "club" | "association" | "bde" | "service" | "autre";
  photo: string | null;
  creeLe: string;
  proprietaire: string | null;
  nbEvenements: number;
  nbMembres: number;
};

export type EvenementAdmin = {
  id: string;
  nom: string;
  pageId: string;
  page: string;
  debut: string;
  statut: "publie" | "modifie" | "annule";
  creeLe: string;
};

export type MembreAdmin = {
  compteId: string;
  nom: string;
  photo: string | null;
  role: "proprietaire" | "contributeur";
  ajouteLe: string;
};

export type DetailPageAdmin = {
  page: PageAdmin;
  membres: MembreAdmin[];
  evenements: EvenementAdmin[];
};
