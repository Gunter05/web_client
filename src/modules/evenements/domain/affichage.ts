import type { Evenement, Periode } from "./evenement";

/** Projection d'un événement pour l'affichage : page organisatrice et période jointes. */
export type PageResumee = {
  id: string;
  nom: string;
  slug: string;
  photo: string | null;
};
export type EvenementAffiche = Evenement & {
  periode: Periode;
  page: PageResumee;
};
