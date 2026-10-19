import "server-only";
import { eventsApi } from "@/modules/events/infrastructure/events.api";
import { PAGE_SIZE } from "@/modules/events/domain/event";
import type { UrlFilters } from "@/modules/events/domain/url-filters";

/**
 * Liste publique (US-01, US-16, US-17) : filtres repris de l'adresse (pages
 * désignées par leur slug), recherche texte, tranche de 20 à partir de `depuis`.
 */
export function listEvents(
  filters: UrlFilters & { search?: string },
  offset = 0,
  limit = PAGE_SIZE,
) {
  const p = new URLSearchParams();
  if (filters.categories.length)
    p.set("category", filters.categories.join(","));
  if (filters.periods.length) p.set("period", filters.periods.join(","));
  if (filters.pages.length) p.set("page", filters.pages.join(","));
  if (filters.search) p.set("q", filters.search);
  p.set("offset", String(offset));
  p.set("limit", String(limit));
  return eventsApi.list(p);
}
