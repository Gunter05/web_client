import "server-only";
import { api, apiOuNull } from "@/shared/api/client";
import type { PageDeResultats } from "../domain/pagination";
import type {
  CompteAdmin,
  DetailPageAdmin,
  EvenementAdmin,
  PageAdmin,
} from "../domain/supervision";

const requete = (q: string, page: number) =>
  new URLSearchParams({ q, page: String(page) }).toString();

/** Adaptateur HTTP du module administration de l'API (lecture seule). */
export const apiAdministration = {
  comptes: (q: string, page: number) =>
    api<PageDeResultats<CompteAdmin>>(
      `/api/v1/admin/comptes?${requete(q, page)}`,
    ),
  pages: (q: string, page: number) =>
    api<PageDeResultats<PageAdmin>>(`/api/v1/admin/pages?${requete(q, page)}`),
  page: (id: string) => apiOuNull<DetailPageAdmin>(`/api/v1/admin/pages/${id}`),
  evenements: (q: string, page: number) =>
    api<PageDeResultats<EvenementAdmin>>(
      `/api/v1/admin/evenements?${requete(q, page)}`,
    ),
};
