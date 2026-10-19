import { traduireErreurApi } from "@/shared/api/client";
import type { DemandePage, Membre, Page } from "../domain/page";
import {
  CHAMPS_FORMULAIRE,
  ERREURS,
  roleDepuisApi,
  statutDepuisApi,
  typeDepuisApi,
} from "./codes-api";

/**
 * Couche anti-corruption entre le module `pages` de l'API (contrat en anglais)
 * et le vocabulaire du front (domaine en français, clés i18n).
 */

// ——— Contrat de l'API (ADR 0013 du backend) ———

export type PageResponse = {
  id: string;
  slug: string;
  name: string;
  description: string;
  type: string;
  photoUrl: string | null;
  createdAt: string;
};

export type PageDetailsResponse = { page: PageResponse; memberCount: number };

export type MembershipResponse = { page: PageResponse; role: string };

export type MemberResponse = {
  accountId: string;
  name: string;
  photoUrl: string | null;
  role: string;
  addedAt: string;
};

export type PageRequestResponse = {
  id: string;
  name: string;
  description: string;
  type: string;
  photoUrl: string | null;
  justification: string;
  status: string;
  rejectionReason: string | null;
  submittedAt: string;
  requester: { id: string; name: string; photoUrl: string | null } | null;
};

export type PageRequestForm = {
  name: string;
  description: string;
  type: string;
  justification: string;
  photoUrl: string | null;
};

// ——— Conversions ———

export const versPage = (p: PageResponse): Page => ({
  id: p.id,
  slug: p.slug,
  nom: p.name,
  description: p.description,
  type: typeDepuisApi(p.type),
  photo: p.photoUrl,
  creeLe: p.createdAt,
});

export const versMembre = (m: MemberResponse): Membre => ({
  compteId: m.accountId,
  nom: m.name,
  photo: m.photoUrl,
  role: roleDepuisApi(m.role),
  ajouteLe: m.addedAt,
});

export const versDemande = (d: PageRequestResponse): DemandePage => ({
  id: d.id,
  nom: d.name,
  description: d.description,
  type: typeDepuisApi(d.type),
  photo: d.photoUrl,
  justification: d.justification,
  statut: statutDepuisApi(d.status),
  motifRefus: d.rejectionReason,
  envoyeeLe: d.submittedAt,
  demandeur: d.requester && {
    id: d.requester.id,
    nom: d.requester.name,
    photo: d.requester.photoUrl,
  },
});

/** Traduit une erreur de l'API dans les codes et noms de champs du front. */
export const traduireErreur = (erreur: unknown) =>
  traduireErreurApi(erreur, ERREURS, CHAMPS_FORMULAIRE);

/** Exécute un appel à l'API en traduisant ses erreurs. */
export async function traduit<T>(appel: () => Promise<T>): Promise<T> {
  try {
    return await appel();
  } catch (erreur) {
    throw traduireErreur(erreur);
  }
}
