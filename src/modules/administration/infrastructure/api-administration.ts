import "server-only";
import { statutDepuisApi } from "@/modules/evenements";
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
  page: async (id: string) => {
    const detail = await apiOuNull<DetailPageAdmin>(
      `/api/v1/admin/pages/${id}`,
    );
    return (
      detail && { ...detail, evenements: detail.evenements.map(statutLocal) }
    );
  },
  evenements: async (q: string, page: number) => {
    const resultats = await api<PageDeResultats<EvenementAdmin>>(
      `/api/v1/admin/evenements?${requete(q, page)}`,
    );
    return { ...resultats, elements: resultats.elements.map(statutLocal) };
  },
};

/** Le module `events` de l'API renvoie ses statuts en anglais (`published`…). */
function statutLocal(e: EvenementAdmin): EvenementAdmin {
  return { ...e, statut: statutDepuisApi(e.statut) };
}
