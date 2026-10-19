import "server-only";
import { api, apiOuNull } from "@/shared/api/client";
import type { EvenementAffiche } from "../domain/affichage";
import {
  categorieVersApi,
  type EventFeedResponse,
  type EventRequest,
  type EventResponse,
  traduit,
  versEvenementAffiche,
} from "./traduction-api";

/** Données du formulaire, dans le vocabulaire du front. */
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

const versRequete = (d: DonneesEnvoyees): EventRequest => ({
  name: d.nom,
  startsAt: d.debut,
  endsAt: d.fin,
  location: d.lieu,
  categories: d.categories.map(categorieVersApi),
  description: d.description,
  photoUrl: d.photo,
});

const evenement = async (appel: Promise<EventResponse>) =>
  versEvenementAffiche(await appel);

/** Adaptateur HTTP du module `events` de l'API. */
export const apiEvenements = {
  lister: (parametres: URLSearchParams) =>
    traduit(async (): Promise<ListeEvenements> => {
      const r = await api<EventFeedResponse>(`/api/v1/events?${parametres}`);
      return {
        evenements: r.events.map(versEvenementAffiche),
        suivant: r.nextOffset,
        total: r.total,
      };
    }),
  fiche: (id: string) =>
    traduit(async () => {
      const r = await apiOuNull<EventResponse>(
        `/api/v1/events/${encodeURIComponent(id)}`,
      );
      return r && versEvenementAffiche(r);
    }),
  deLaPage: (slug: string) =>
    traduit(async () =>
      (
        await api<EventResponse[]>(
          `/api/v1/pages/${encodeURIComponent(slug)}/events`,
        )
      ).map(versEvenementAffiche),
    ),
  creer: (pageId: string, d: DonneesEnvoyees) =>
    traduit(() =>
      evenement(
        api<EventResponse>(`/api/v1/pages/${pageId}/events`, {
          corps: versRequete(d),
        }),
      ),
    ),
  modifier: (pageId: string, id: string, d: DonneesEnvoyees) =>
    traduit(() =>
      evenement(
        api<EventResponse>(`/api/v1/pages/${pageId}/events/${id}`, {
          methode: "PUT",
          corps: versRequete(d),
        }),
      ),
    ),
  annuler: (pageId: string, id: string, motif: string) =>
    traduit(() =>
      evenement(
        api<EventResponse>(
          `/api/v1/pages/${pageId}/events/${id}/cancellation`,
          { corps: { reason: motif } },
        ),
      ),
    ),
};
