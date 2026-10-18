import "server-only";
import { api, apiOuNull } from "@/shared/api/client";
import type {
  DemandePage,
  FormulaireDemande,
  Membre,
  Page,
  Role,
} from "../domain/page";

/** Adaptateur HTTP du module pages de l'API. */
export const apiPages = {
  pages: () => api<Page[]>("/api/v1/pages"),
  page: (slug: string) =>
    apiOuNull<{ page: Page; nbMembres: number }>(
      `/api/v1/pages/${encodeURIComponent(slug)}`,
    ),
  mesPages: () => api<{ page: Page; role: Role }[]>("/api/v1/moi/pages"),
  membres: (pageId: string) => api<Membre[]>(`/api/v1/pages/${pageId}/membres`),
  derniereDemande: async () =>
    (await api<DemandePage | undefined>("/api/v1/moi/demande-page")) ?? null,
  deposer: (f: FormulaireDemande) =>
    api<DemandePage>("/api/v1/demandes-page", { corps: f }),
  retirer: (id: string) =>
    api<void>(`/api/v1/demandes-page/${id}`, { methode: "DELETE" }),
  demandesEnAttente: () => api<DemandePage[]>("/api/v1/admin/demandes-page"),
  demande: (id: string) =>
    apiOuNull<DemandePage>(`/api/v1/admin/demandes-page/${id}`),
  accepter: (id: string) =>
    api<Page>(`/api/v1/admin/demandes-page/${id}/acceptation`, {
      methode: "POST",
    }),
  refuser: (id: string, motif: string) =>
    api<void>(`/api/v1/admin/demandes-page/${id}/refus`, { corps: { motif } }),
  donnerAcces: (pageId: string, compteId: string) =>
    api<void>(`/api/v1/pages/${pageId}/membres`, { corps: { compteId } }),
  retirerAcces: (pageId: string, compteId: string) =>
    api<void>(`/api/v1/pages/${pageId}/membres/${compteId}`, {
      methode: "DELETE",
    }),
};
