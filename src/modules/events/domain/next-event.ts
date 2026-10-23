import type { EventView } from "@/modules/events/domain/event-view.types";

/**
 * Prochain événement d'une liste déjà chargée (page publique) : le premier à
 * venir, c'est-à-dire celui qui commence le plus tôt parmi les événements à
 * venir non annulés. `null` s'il n'y en a aucun.
 */
export function nextEvent<E extends EventView>(events: readonly E[]): E | null {
  let next: E | null = null;
  for (const e of events) {
    if (e.period !== "upcoming" || e.status === "cancelled") continue;
    if (!next || Date.parse(e.startsAt) < Date.parse(next.startsAt)) next = e;
  }
  return next;
}
