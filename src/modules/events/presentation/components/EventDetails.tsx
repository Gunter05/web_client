"use client";

import type { ComponentProps } from "react";
import { EventOverview } from "@/modules/events/presentation/components/EventOverview";

/**
 * Fiche d'un événement (US-01) : la présentation en zones ({@link
 * EventOverview}) en mise en page « page », avec la carte de l'organisateur,
 * les autres événements et la barre d'actions fixe sur téléphone.
 */
export function EventDetails(
  props: Omit<ComponentProps<typeof EventOverview>, "layout" | "title">,
) {
  return <EventOverview {...props} layout="page" />;
}
