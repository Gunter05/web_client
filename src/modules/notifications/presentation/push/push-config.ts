import { firebaseWebConfig } from "@/modules/notifications/domain/push";
import { clientEnv } from "@/shared/config/env.client";

/** Configuration Firebase publique (ADR 0017) ; `null` si les push sont désactivés. */
export const push = firebaseWebConfig({
  apiKey: clientEnv.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: clientEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: clientEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: clientEnv.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: clientEnv.NEXT_PUBLIC_FIREBASE_APP_ID,
  vapidKey: clientEnv.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
});

/**
 * Test sans le SDK Firebase : configuré, et navigateur capable de push. Le
 * SDK (lourd) n'est chargé que si ce test passe et qu'on en a besoin.
 */
export function pushPossible(): boolean {
  return (
    push !== null && "Notification" in window && "serviceWorker" in navigator
  );
}
