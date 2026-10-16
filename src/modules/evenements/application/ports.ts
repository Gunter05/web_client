import type { Evenement } from "../domain/evenement";

export type DepotEvenements = {
  tous(): Evenement[];
  ajouter(evenement: Evenement): void;
  modifier(evenement: Evenement): void;
};

/** Fourni par l'app à partir du module pages : qui peut publier pour quelle page. */
export type Autorisation = (pageId: string, compteId: string) => boolean;
