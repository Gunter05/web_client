import "server-only";
import { api } from "@/shared/api/client";

/** Client du module `mesure` de l'API Spring (encore en français côté API). */
export const metricsApi = {
  trackShare: (eventId: string, visitorId: string) =>
    api<void>(`/api/v1/evenements/${encodeURIComponent(eventId)}/partages`, {
      body: { visiteurId: visitorId },
    }),
  /** Visite du jour d'un visiteur anonyme, navigateur ou application installée. */
  trackVisit: (visitorId: string, installedApp: boolean) =>
    api<void>("/api/v1/visites", {
      body: { visiteurId: visitorId, modeApplication: installedApp },
    }),
  /** Installation signalée par le navigateur (Chrome et Android seulement). */
  trackInstall: (visitorId: string) =>
    api<void>("/api/v1/installations", { body: { visiteurId: visitorId } }),
};
