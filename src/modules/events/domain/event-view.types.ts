import type { Event, Period } from "@/modules/events/domain/event";

/** Projection d'un événement pour l'affichage : page organisatrice et période jointes. */
export type PageSummary = {
  id: string;
  name: string;
  slug: string;
  photoUrl: string | null;
};
/**
 * Disposition de la photo avant son chargement (ADR 0014 du backend) :
 * dimensions en pixels et aperçu flou (ThumbHash en base64).
 */
export type PhotoLayout = {
  width: number;
  height: number;
  placeholder: string | null;
};
export type EventView = Event & {
  period: Period;
  organizer: PageSummary;
  /** Absent pour les photos envoyées avant l'enregistrement des dimensions. */
  photo?: PhotoLayout | null;
};
