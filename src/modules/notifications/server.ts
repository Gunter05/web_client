import "server-only";
import { notificationsApi } from "@/modules/notifications/infrastructure/notifications.api";

export type {
  Notification,
  NotificationType,
} from "@/modules/notifications/domain/notification.types";

/** Notifications du compte connecté (cloche). */
export const getRecentNotifications = notificationsApi.latest;
export const countUnread = notificationsApi.unreadCount;
export const markAllRead = notificationsApi.markAllRead;
