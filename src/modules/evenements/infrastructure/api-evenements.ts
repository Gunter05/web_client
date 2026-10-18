import "server-only";
import { api, apiOuNull } from "@/shared/api/client";
import type { EvenementAffiche } from "../domain/affichage";

export type DonneesEnvoyees = {
  nom: string;
  debut: string | null;
  fin: string | null;
  lieu: string;
  categories: string[];
  description: string;
  photo: string | null;
};

export type ListeEvenements = {
  evenements: EvenementAffiche[];
  suivant: number | null;
  total: number;
};

/** Adaptateur HTTP du module evenements de l'API. */
export const apiEvenements = {
  lister: (parametres: URLSearchParams) =>
    api<ListeEvenements>(`/api/v1/evenements?${parametres}`),
  fiche: (id: string) =>
    apiOuNull<EvenementAffiche>(`/api/v1/evenements/${encodeURIComponent(id)}`),
  deLaPage: (slug: string) =>
    api<EvenementAffiche[]>(
      `/api/v1/pages/${encodeURIComponent(slug)}/evenements`,
    ),
  creer: (pageId: string, d: DonneesEnvoyees) =>
    api<EvenementAffiche>(`/api/v1/pages/${pageId}/evenements`, { corps: d }),
  modifier: (pageId: string, id: string, d: DonneesEnvoyees) =>
    api<EvenementAffiche>(`/api/v1/pages/${pageId}/evenements/${id}`, {
      methode: "PUT",
      corps: d,
    }),
  annuler: (pageId: string, id: string, motif: string) =>
    api<EvenementAffiche>(
      `/api/v1/pages/${pageId}/evenements/${id}/annulation`,
      { corps: { motif } },
    ),
};
