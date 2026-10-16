import "server-only";
import { collection } from "@/shared/stockage/collection-json";
import type { DemandePage, Membre, Page } from "../domain/page";
import type {
  DepotDemandes,
  DepotMembres,
  DepotPages,
} from "../application/ports";
import { demandesDemo, membresDemo, pagesDemo } from "./donnees-demo";

const pages = collection<Page>("pages", pagesDemo);
const membres = collection<Membre>("membres", membresDemo);
const demandes = collection<DemandePage>("demandes-page", demandesDemo);

export const depotPagesJson: DepotPages = {
  toutes: () => pages.tous(),
  ajouter: (page) => pages.muter((l) => [...l, page]),
};

export const depotMembresJson: DepotMembres = {
  tous: () => membres.tous(),
  ajouter: (membre) => membres.muter((l) => [...l, membre]),
  retirer: (pageId, compteId) =>
    membres.muter((l) =>
      l.filter((m) => !(m.pageId === pageId && m.compteId === compteId)),
    ),
};

export const depotDemandesJson: DepotDemandes = {
  toutes: () => demandes.tous(),
  ajouter: (demande) => demandes.muter((l) => [...l, demande]),
  modifier: (demande) =>
    demandes.muter((l) => l.map((d) => (d.id === demande.id ? demande : d))),
};
