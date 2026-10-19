"use server";

import { trackView, currentVisitor } from "@/modules/audience/server";
import { trackShare } from "@/modules/metrics/server";
import { idField } from "@/shared/lib/form";

/**
 * Ouverture d'une fiche : vue unique (US-39) et métriques « fiche consultée »
 * et « arrivée par lien partagé », prises par l'API.
 */
export async function trackEventViewAction(
  eventId: string,
  fromShareLink: boolean,
): Promise<void> {
  const id = idField.safeParse(eventId);
  if (!id.success) return;
  await trackView(id.data, fromShareLink === true).catch(() => {
    // Une mesure perdue ne doit jamais gêner la lecture de la fiche.
  });
}

export async function trackShareClickAction(eventId: string): Promise<void> {
  const id = idField.safeParse(eventId);
  if (!id.success) return;
  await trackShare(id.data, await currentVisitor()).catch(() => {});
}
