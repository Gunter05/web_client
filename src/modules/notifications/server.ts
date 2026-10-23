import "server-only";
import { SDK_VERSION } from "firebase/app";
import { notificationsApi } from "@/modules/notifications/infrastructure/notifications.api";
import { pushDevicesApi } from "@/modules/notifications/infrastructure/push-devices.api";
import {
  firebaseWebConfig,
  serviceWorkerScript,
} from "@/modules/notifications/domain/push";
import { clientEnv } from "@/shared/config/env.client";

export type {
  Notification,
  NotificationType,
} from "@/modules/notifications/domain/notification.types";

/** Notifications du compte connecté (cloche). */
export const getRecentNotifications = notificationsApi.latest;
export const countUnread = notificationsApi.unreadCount;
export const markAllRead = notificationsApi.markAllRead;

// ——— Notifications push (ADR 0017) ———
export const registerPushDevice = pushDevicesApi.register;
export const unregisterPushDevice = pushDevicesApi.unregister;
/** À appeler avant d'effacer la session : le push suit le compte connecté. */
export const forgetPushDevice = pushDevicesApi.forgetThisBrowser;

/** Script du service worker, ou `null` si Firebase n'est pas configuré. */
export function pushServiceWorker(): string | null {
  const push = firebaseWebConfig({
    apiKey: clientEnv.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: clientEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: clientEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    messagingSenderId: clientEnv.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: clientEnv.NEXT_PUBLIC_FIREBASE_APP_ID,
    vapidKey: clientEnv.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
  });
  return push && serviceWorkerScript(push.config, SDK_VERSION);
}
