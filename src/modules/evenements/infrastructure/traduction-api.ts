import { ErreurApi } from "@/shared/api/client";
import type { EvenementAffiche } from "../domain/affichage";
import type { Changement } from "../domain/evenement";
import {
  CATEGORIES_API,
  CHAMPS_FORMULAIRE,
  CHAMPS_SUIVIS_API,
  ERREURS,
  PERIODES_API,
  statutDepuisApi,
} from "./codes-api";

export { categorieVersApi, periodeVersApi } from "./codes-api";

/**
 * Couche anti-corruption entre le module `events` de l'API (contrat en
 * anglais) et le vocabulaire du front (domaine en français, clés i18n).
 * Toute la correspondance des noms et des codes vit ici.
 */

// ——— Contrat de l'API (ADR 0012 du backend) ———

export type EventResponse = {
  id: string;
  organizerPageId: string;
  name: string;
  startsAt: string;
  endsAt: string | null;
  location: string;
  categories: string[];
  description: string | null;
  photoUrl: string | null;
  status: string;
  period: string;
  latestUpdate: {
    at: string;
    changes: { field: string; before: string | null; after: string | null }[];
  } | null;
  cancellation: { reason: string; at: string } | null;
  createdAt: string;
  organizer: {
    id: string;
    slug: string;
    name: string;
    photoUrl: string | null;
  };
};

export type EventFeedResponse = {
  events: EventResponse[];
  nextOffset: number | null;
  total: number;
};

export type EventRequest = {
  name: string;
  startsAt: string | null;
  endsAt: string | null;
  location: string;
  categories: string[];
  description: string;
  photoUrl: string | null;
};

// ——— Conversions ———

export function versEvenementAffiche(e: EventResponse): EvenementAffiche {
  return {
    id: e.id,
    pageId: e.organizerPageId,
    nom: e.name,
    debut: e.startsAt,
    fin: e.endsAt,
    lieu: e.location,
    categories: e.categories.flatMap((c) =>
      CATEGORIES_API[c] ? [CATEGORIES_API[c]] : [],
    ),
    description: e.description,
    photo: e.photoUrl,
    statut: statutDepuisApi(e.status),
    periode: PERIODES_API[e.period] ?? "a_venir",
    derniereModification: e.latestUpdate && {
      le: e.latestUpdate.at,
      changements: e.latestUpdate.changes.flatMap((c): Changement[] => {
        const champ = CHAMPS_SUIVIS_API[c.field];
        return champ ? [{ champ, avant: c.before, apres: c.after }] : [];
      }),
    },
    annulation: e.cancellation && {
      motif: e.cancellation.reason,
      le: e.cancellation.at,
    },
    creeLe: e.createdAt,
    page: {
      id: e.organizer.id,
      slug: e.organizer.slug,
      nom: e.organizer.name,
      photo: e.organizer.photoUrl,
    },
  };
}

/** Traduit une erreur de l'API dans les codes et noms de champs du front. */
export function traduireErreur(erreur: unknown): unknown {
  if (!(erreur instanceof ErreurApi)) return erreur;
  const champs = erreur.champs
    ? Object.fromEntries(
        Object.entries(erreur.champs).map(([champ, code]) => [
          CHAMPS_FORMULAIRE[champ] ?? champ,
          ERREURS[code] ?? code,
        ]),
      )
    : undefined;
  return new ErreurApi(
    erreur.statut,
    ERREURS[erreur.code] ?? erreur.code,
    champs,
  );
}

/** Exécute un appel à l'API en traduisant ses erreurs. */
export async function traduit<T>(appel: () => Promise<T>): Promise<T> {
  try {
    return await appel();
  } catch (erreur) {
    throw traduireErreur(erreur);
  }
}
