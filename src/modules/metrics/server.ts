import "server-only";
import { metricsApi } from "@/modules/metrics/infrastructure/metrics.api";

/**
 * Clic sur « Partager » (métrique Viralité). Les autres mesures (fiche
 * consultée, arrivée par lien partagé, publication) sont prises par l'API.
 */
export const trackShare = (eventId: string, visitorId: string) =>
  metricsApi.trackShare(eventId, visitorId);

/** Activité des visiteurs anonymes (visiteurs uniques par jour, application installée). */
export const trackVisit = (visitorId: string, installedApp: boolean) =>
  metricsApi.trackVisit(visitorId, installedApp);
export const trackInstall = (visitorId: string) =>
  metricsApi.trackInstall(visitorId);
