import "server-only";
import { api } from "@/shared/api/client";

/** Client du module `mesure` de l'API Spring (encore en français côté API). */
export const metricsApi = {
  trackShare: (eventId: string, visitorId: string) =>
    api<void>(`/api/v1/evenements/${encodeURIComponent(eventId)}/partages`, {
      body: { visiteurId: visitorId },
    }),
};
