import type { Event, Period } from "@/modules/events/domain/event";

/** Projection d'un événement pour l'affichage : page organisatrice et période jointes. */
export type PageSummary = {
  id: string;
  name: string;
  slug: string;
  photoUrl: string | null;
};
export type EventView = Event & {
  period: Period;
  organizer: PageSummary;
};
