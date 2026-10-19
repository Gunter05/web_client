import "server-only";
import { metricsApi } from "@/modules/metrics/infrastructure/metrics.api";

/**
 * Clic sur « Partager » (métrique Viralité). Les autres mesures (fiche
 * consultée, arrivée par lien partagé, publication) sont prises par l'API.
 */
export const trackShare = (eventId: string, visitorId: string) =>
  metricsApi.trackShare(eventId, visitorId);
