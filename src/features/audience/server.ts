import "server-only";
import {
  apiAudience,
  userAgentCourant,
  visiteurCourant,
} from "@/features/audience/api/audience.api";

export { visiteurCourant };

/**
 * Ouverture d'une fiche : l'API compte une vue unique par jour (sans robots ni
 * membres de la page) et mesure la consultation. Le User-Agent du navigateur
 * est relayé, car l'appel part du serveur Next.js.
 */
export async function signalerOuverture(
  evenementId: string,
  viaLienPartage: boolean,
): Promise<void> {
  await apiAudience.ouverture(evenementId, {
    visiteurId: await visiteurCourant(),
    agent: await userAgentCourant(),
    viaLienPartage,
  });
}

/** Vues des événements d'une page, réservées à ses membres. */
export async function compterVues(
  pageId: string,
  evenementIds: readonly string[],
): Promise<Map<string, number>> {
  if (!evenementIds.length) return new Map();
  return new Map(Object.entries(await apiAudience.vues(pageId, evenementIds)));
}
