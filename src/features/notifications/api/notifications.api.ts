import "server-only";
import { api } from "@/shared/api/client";
import type { Notification } from "@/features/notifications/types/notification.types";

/** Adaptateur HTTP du module notifications de l'API. */
export const apiNotifications = {
  recentes: () => api<Notification[]>("/api/v1/moi/notifications"),
  nonLues: async () =>
    (await api<{ nonLues: number }>("/api/v1/moi/notifications/non-lues"))
      .nonLues,
  marquerLues: () =>
    api<void>("/api/v1/moi/notifications/lecture", { methode: "POST" }),
};
