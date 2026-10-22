import "server-only";
import { api } from "@/shared/api/client";
import {
  isKnownType,
  type Notification,
} from "@/modules/notifications/domain/notification.types";

/** Notification telle que l'API la renvoie : son type peut être inconnu du front. */
type NotificationResponse = Omit<Notification, "type"> & { type: string };

/**
 * Client du module `notifications` de l'API Spring. Les types du front
 * reprennent exactement le contrat de l'API : les réponses sont utilisées
 * telles quelles. Un type inconnu du front (API plus récente) est ignoré
 * plutôt que d'afficher une clé brute.
 */
export const notificationsApi = {
  latest: async () =>
    (await api<NotificationResponse[]>("/api/v1/me/notifications")).filter(
      (n): n is Notification => isKnownType(n.type),
    ),
  unreadCount: async () =>
    (await api<{ count: number }>("/api/v1/me/notifications/unread-count"))
      .count,
  markAllRead: () =>
    api<void>("/api/v1/me/notifications/read", { method: "POST" }),
};
