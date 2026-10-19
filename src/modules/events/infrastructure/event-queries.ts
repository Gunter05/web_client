import "server-only";
import { listEvents } from "@/modules/events/infrastructure/list-events";
import {
  type Category,
  PERIODS,
  type Period,
} from "@/modules/events/domain/event";
import type { UrlFilters } from "@/modules/events/domain/url-filters";
import type { PageSummary } from "@/modules/events/domain/event-view.types";
import { getAllPages } from "@/modules/pages/server";

/** Liste filtrée par l'adresse (US-17) ; les pages y sont désignées par leur slug. */
export function listEventsFromUrl(filters: UrlFilters, offset = 0) {
  return listEvents(filters, offset);
}

/** Choix du filtre Page et carrousel de l'accueil. */
export async function getFilterPages(): Promise<PageSummary[]> {
  return (await getAllPages()).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    photoUrl: p.photoUrl,
  }));
}

/** Nombre maximal de vignettes affichées par une recherche. */
const MAX_RESULTS = 60;

/**
 * Recherche (onglet Rechercher) : texte sur le nom, le lieu, la description
 * et la page organisatrice ; période unique ou toutes ; catégories (OU).
 */
export async function searchEvents(r: {
  text: string;
  period: Period | null;
  categories: Category[];
}) {
  const { events, total } = await listEvents(
    {
      categories: r.categories,
      periods: r.period ? [r.period] : [...PERIODS],
      pages: [],
      search: r.text,
    },
    0,
    MAX_RESULTS,
  );
  return { events, total };
}
