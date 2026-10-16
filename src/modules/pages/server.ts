import "server-only";
import { horlogeSysteme } from "@/shared/lib/horloge";
import * as cas from "./application/cas-usage";
import type { Acteur, DepsPages } from "./application/cas-usage";
import type { FormulaireDemande, Page } from "./domain/page";
import {
  depotDemandesJson,
  depotMembresJson,
  depotPagesJson,
} from "./infrastructure/depots-json";

export type { Acteur };

const deps: DepsPages = {
  pages: depotPagesJson,
  membres: depotMembresJson,
  demandes: depotDemandesJson,
  horloge: horlogeSysteme,
};

export const toutesLesPages = (): Page[] => deps.pages.toutes();
export const pageParId = (id: string) =>
  deps.pages.toutes().find((p) => p.id === id) ?? null;
export const pageParSlug = (slug: string) =>
  deps.pages.toutes().find((p) => p.slug === slug) ?? null;
export const pagesParIds = (ids: readonly string[]) => {
  const voulus = new Set(ids);
  return new Map(
    deps.pages
      .toutes()
      .filter((p) => voulus.has(p.id))
      .map((p) => [p.id, p]),
  );
};

export const roleDe = (pageId: string, compteId: string) =>
  cas.roleDe(deps, pageId, compteId);
export const estMembre = (pageId: string, compteId: string) =>
  cas.roleDe(deps, pageId, compteId) !== null;
export const pagesDuMembre = (compteId: string) =>
  cas.pagesDuMembre(deps, compteId);
export const membresDe = (pageId: string) => cas.membresDe(deps, pageId);
export const tousLesMembres = () => deps.membres.tous();

export const derniereDemandeDe = (compteId: string) =>
  cas.derniereDemandeDe(deps, compteId);
export const demandesEnAttente = () => cas.demandesEnAttente(deps);
export const demandeParId = (id: string) =>
  deps.demandes.toutes().find((d) => d.id === id) ?? null;

export const deposerDemande = (
  demandeurId: string,
  formulaire: FormulaireDemande,
  photo: string | null,
) => cas.deposerDemande(deps, demandeurId, formulaire, photo);
export const retirerDemande = (demandeurId: string, demandeId: string) =>
  cas.retirerDemande(deps, demandeurId, demandeId);
export const accepterDemande = (acteur: Acteur, demandeId: string) =>
  cas.accepterDemande(deps, acteur, demandeId);
export const refuserDemande = (
  acteur: Acteur,
  demandeId: string,
  motif: string,
) => cas.refuserDemande(deps, acteur, demandeId, motif);
export const donnerAcces = (
  proprietaireId: string,
  pageId: string,
  compteId: string,
) => cas.donnerAcces(deps, proprietaireId, pageId, compteId);
export const retirerAcces = (
  proprietaireId: string,
  pageId: string,
  compteId: string,
) => cas.retirerAcces(deps, proprietaireId, pageId, compteId);
