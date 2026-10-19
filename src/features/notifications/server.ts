import "server-only";
import { apiNotifications } from "@/features/notifications/api/notifications.api";

export type {
  Notification,
  TypeNotification,
} from "@/features/notifications/types/notification.types";

/** Notifications du compte connecté (cloche). */
export const notificationsRecentes = apiNotifications.recentes;
export const nombreNonLues = apiNotifications.nonLues;
export const marquerToutesLues = apiNotifications.marquerLues;
