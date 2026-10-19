import "server-only";
import { api } from "@/shared/api/client";

/** Adaptateur HTTP du module mesure de l'API. */
export const apiMesures = {
  partage: (evenementId: string, visiteurId: string) =>
    api<void>(
      `/api/v1/evenements/${encodeURIComponent(evenementId)}/partages`,
      {
        corps: { visiteurId },
      },
    ),
};
