import "server-only";
import { horlogeSysteme } from "@/shared/lib/horloge";
import * as cas from "./application/cas-usage";
import {
  depotVuesJson,
  userAgentCourant,
  visiteurCourant,
} from "./infrastructure/adapters";

const deps: cas.DepsAudience = { vues: depotVuesJson, horloge: horlogeSysteme };

export { visiteurCourant };

/** Enregistre l'ouverture d'une fiche par le visiteur courant. */
export async function enregistrerOuverture(
  evenementId: string,
  estMembreOrganisateur: boolean,
) {
  const visiteurId = await visiteurCourant();
  cas.enregistrerOuverture(deps, {
    evenementId,
    visiteurId,
    userAgent: await userAgentCourant(),
    estMembreOrganisateur,
  });
  return visiteurId;
}

export const compterVues = (evenementIds: readonly string[]) =>
  cas.compterVues(deps, evenementIds);
