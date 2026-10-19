import "server-only";
import {
  audienceApi,
  currentUserAgent,
  currentVisitor,
} from "@/modules/audience/infrastructure/audience.api";

export { currentVisitor };

/**
 * Ouverture d'une fiche : l'API compte une vue unique par jour (sans robots ni
 * membres de la page) et mesure la consultation. Le User-Agent du navigateur
 * est relayé, car l'appel part du serveur Next.js.
 */
export async function trackView(
  eventId: string,
  fromShareLink: boolean,
): Promise<void> {
  await audienceApi.trackView(eventId, {
    visitorId: await currentVisitor(),
    userAgent: await currentUserAgent(),
    fromShareLink,
  });
}

/** Vues des événements d'une page, réservées à ses membres. */
export async function countViews(
  pageId: string,
  eventIds: readonly string[],
): Promise<Map<string, number>> {
  if (!eventIds.length) return new Map();
  return new Map(
    Object.entries(await audienceApi.viewCounts(pageId, eventIds)),
  );
}
