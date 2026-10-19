import "server-only";
import { apiNotifications } from "./infrastructure/api-notifications";

export type { Notification, TypeNotification } from "./domain/notification";

/** Notifications du compte connecté (cloche). */
export const notificationsRecentes = apiNotifications.recentes;
export const nombreNonLues = apiNotifications.nonLues;
export const marquerToutesLues = apiNotifications.marquerLues;
