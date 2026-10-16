import "server-only";
import { collection } from "@/shared/stockage/collection-json";
import type { DepotEvenements } from "../application/ports";
import type { Evenement } from "../domain/evenement";
import { evenementsDemo } from "./donnees-demo";

const evenements = collection<Evenement>("evenements", evenementsDemo);

export const depotEvenementsJson: DepotEvenements = {
  tous: () => evenements.tous(),
  ajouter: (e) => evenements.muter((l) => [...l, e]),
  modifier: (e) =>
    evenements.muter((l) => l.map((x) => (x.id === e.id ? e : x))),
};
