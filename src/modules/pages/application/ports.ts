import type { DemandePage, Membre, Page } from "../domain/page";

export type DepotPages = {
  toutes(): Page[];
  ajouter(page: Page): void;
};

export type DepotMembres = {
  tous(): Membre[];
  ajouter(membre: Membre): void;
  retirer(pageId: string, compteId: string): void;
};

export type DepotDemandes = {
  toutes(): DemandePage[];
  ajouter(demande: DemandePage): void;
  modifier(demande: DemandePage): void;
};
