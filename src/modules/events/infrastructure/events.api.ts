import "server-only";
import { api, apiOrNull } from "@/shared/api/client";
import { withTranslatedErrors } from "@/modules/events/infrastructure/errors";
import type { Category } from "@/modules/events/domain/event";
import type { EventView } from "@/modules/events/domain/event-view.types";

/** Corps d'un événement envoyé à l'API (publication et modification). */
export type EventPayload = {
  name: string;
  startsAt: string | null;
  endsAt: string | null;
  location: string;
  categories: Category[];
  description: string;
  photoUrl: string | null;
};

/** Une tranche du fil, avec la position de la suivante. */
export type EventSlice = {
  events: EventView[];
  nextOffset: number | null;
  total: number;
  /** Instant du classement, à renvoyer avec les tranches suivantes (ADR 0020 du backend). */
  asOf?: string;
};

/**
 * Client du module `events` de l'API Spring. Les types du front reprennent
 * exactement le contrat de l'API : les réponses sont utilisées telles quelles.
 */
export const eventsApi = {
  list: (params: URLSearchParams) =>
    withTranslatedErrors(() => api<EventSlice>(`/api/v1/events?${params}`)),
  getById: (id: string) =>
    withTranslatedErrors(() =>
      apiOrNull<EventView>(`/api/v1/events/${encodeURIComponent(id)}`),
    ),
  listByPage: (slug: string) =>
    withTranslatedErrors(() =>
      api<EventView[]>(`/api/v1/pages/${encodeURIComponent(slug)}/events`),
    ),
  create: (pageId: string, body: EventPayload) =>
    withTranslatedErrors(() =>
      api<EventView>(`/api/v1/pages/${pageId}/events`, { body }),
    ),
  update: (pageId: string, id: string, body: EventPayload) =>
    withTranslatedErrors(() =>
      api<EventView>(`/api/v1/pages/${pageId}/events/${id}`, {
        method: "PUT",
        body,
      }),
    ),
  cancel: (pageId: string, id: string, reason: string) =>
    withTranslatedErrors(() =>
      api<EventView>(`/api/v1/pages/${pageId}/events/${id}/cancellation`, {
        body: { reason },
      }),
    ),
  /** Épinglage éditorial en tête du fil, réservé aux admins (ADR 0020 du backend). */
  pin: (id: string, until: string) =>
    withTranslatedErrors(() =>
      api<void>(`/api/v1/admin/events/${encodeURIComponent(id)}/pin`, {
        method: "PUT",
        body: { until },
      }),
    ),
  unpin: (id: string) =>
    withTranslatedErrors(() =>
      api<void>(`/api/v1/admin/events/${encodeURIComponent(id)}/pin`, {
        method: "DELETE",
      }),
    ),
  /**
   * Suppression définitive par un admin (ADR 0021 du backend) : l'événement,
   * ses données et sa photo dans le stockage.
   */
  remove: (id: string) =>
    withTranslatedErrors(() =>
      api<void>(`/api/v1/admin/events/${encodeURIComponent(id)}`, {
        method: "DELETE",
      }),
    ),
};
