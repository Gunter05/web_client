"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, isSupported, type Messaging } from "firebase/messaging";
import {
  firebaseWebConfig,
  SERVICE_WORKER_PATH,
} from "@/modules/notifications/domain/push";
import { clientEnv } from "@/shared/config/env.client";

const push = firebaseWebConfig({
  apiKey: clientEnv.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: clientEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: clientEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: clientEnv.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: clientEnv.NEXT_PUBLIC_FIREBASE_APP_ID,
  vapidKey: clientEnv.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
});

export const VAPID_KEY = push?.vapidKey ?? "";

/**
 * Le navigateur peut-il recevoir des push ? Non si Firebase n'est pas
 * configuré, ni sur iPhone tant que le site n'est pas installé sur l'écran
 * d'accueil (Web Push n'y existe que pour les applications installées).
 */
export async function pushAvailable(): Promise<boolean> {
  return (
    push !== null &&
    "Notification" in window &&
    "serviceWorker" in navigator &&
    (await isSupported().catch(() => false))
  );
}

/** Messagerie Firebase et service worker qui affiche les push en arrière-plan. */
export async function firebaseMessaging(): Promise<{
  messaging: Messaging;
  serviceWorkerRegistration: ServiceWorkerRegistration;
}> {
  if (!push) throw new Error("Firebase n'est pas configuré");
  const app = getApps().length ? getApp() : initializeApp(push.config);
  const serviceWorkerRegistration = await navigator.serviceWorker.register(
    SERVICE_WORKER_PATH,
    { updateViaCache: "none" },
  );
  return { messaging: getMessaging(app), serviceWorkerRegistration };
}
