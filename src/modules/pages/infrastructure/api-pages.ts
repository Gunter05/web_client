import "server-only";
import { api, apiOuNull } from "@/shared/api/client";
import type { FormulaireDemande } from "../domain/page";
import { roleDepuisApi, typeVersApi } from "./codes-api";
import {
  type MemberResponse,
  type MembershipResponse,
  type PageDetailsResponse,
  type PageRequestForm,
  type PageRequestResponse,
  type PageResponse,
  traduit,
  versDemande,
  versMembre,
  versPage,
} from "./traduction-api";

const versFormulaireApi = (f: FormulaireDemande): PageRequestForm => ({
  name: f.nom,
  description: f.description,
  type: typeVersApi(f.type),
  justification: f.justification,
  photoUrl: f.photo,
});

/** Adaptateur HTTP du module `pages` de l'API. */
export const apiPages = {
  pages: () =>
    traduit(async () =>
      (await api<PageResponse[]>("/api/v1/pages")).map(versPage),
    ),
  page: (slug: string) =>
    traduit(async () => {
      const r = await apiOuNull<PageDetailsResponse>(
        `/api/v1/pages/${encodeURIComponent(slug)}`,
      );
      return r && { page: versPage(r.page), nbMembres: r.memberCount };
    }),
  mesPages: () =>
    traduit(async () =>
      (await api<MembershipResponse[]>("/api/v1/me/pages")).map((m) => ({
        page: versPage(m.page),
        role: roleDepuisApi(m.role),
      })),
    ),
  membres: (pageId: string) =>
    traduit(async () =>
      (await api<MemberResponse[]>(`/api/v1/pages/${pageId}/members`)).map(
        versMembre,
      ),
    ),
  derniereDemande: () =>
    traduit(async () => {
      const r = await api<PageRequestResponse | undefined>(
        "/api/v1/me/page-request",
      );
      return r ? versDemande(r) : null;
    }),
  deposer: (f: FormulaireDemande) =>
    traduit(async () =>
      versDemande(
        await api<PageRequestResponse>("/api/v1/page-requests", {
          corps: versFormulaireApi(f),
        }),
      ),
    ),
  retirer: (id: string) =>
    traduit(() =>
      api<void>(`/api/v1/page-requests/${id}`, { methode: "DELETE" }),
    ),
  demandesEnAttente: () =>
    traduit(async () =>
      (await api<PageRequestResponse[]>("/api/v1/admin/page-requests")).map(
        versDemande,
      ),
    ),
  demande: (id: string) =>
    traduit(async () => {
      const r = await apiOuNull<PageRequestResponse>(
        `/api/v1/admin/page-requests/${id}`,
      );
      return r && versDemande(r);
    }),
  accepter: (id: string) =>
    traduit(async () =>
      versPage(
        await api<PageResponse>(
          `/api/v1/admin/page-requests/${id}/acceptance`,
          {
            methode: "POST",
          },
        ),
      ),
    ),
  refuser: (id: string, motif: string) =>
    traduit(() =>
      api<void>(`/api/v1/admin/page-requests/${id}/rejection`, {
        corps: { reason: motif },
      }),
    ),
  donnerAcces: (pageId: string, compteId: string) =>
    traduit(() =>
      api<void>(`/api/v1/pages/${pageId}/members`, {
        corps: { accountId: compteId },
      }),
    ),
  retirerAcces: (pageId: string, compteId: string) =>
    traduit(() =>
      api<void>(`/api/v1/pages/${pageId}/members/${compteId}`, {
        methode: "DELETE",
      }),
    ),
};
