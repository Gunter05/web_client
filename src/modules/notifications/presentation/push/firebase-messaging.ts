"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, isSupported, type Messaging } from "firebase/messaging";
import { SERVICE_WORKER_PATH } from "@/modules/notifications/domain/push";
import {
  push,
  pushPossible,
} from "@/modules/notifications/presentation/push/push-config";

/**
 * SDK Firebase (plusieurs centaines de Ko) : ce module n'est chargé qu'à la
 * demande, par import dynamique, jamais au chargement des pages.
 */
export {
  onMessage,
  onRegistered,
  onUnregistered,
  register,
  unregister,
} from "firebase/messaging";

export const VAPID_KEY = push?.vapidKey ?? "";

/**
 * Le navigateur peut-il recevoir des push ? Non si Firebase n'est pas
 * configuré, ni sur iPhone tant que le site n'est pas installé sur l'écran
 * d'accueil (Web Push n'y existe que pour les applications installées).
 */
export async function pushAvailable(): Promise<boolean> {
  return pushPossible() && (await isSupported().catch(() => false));
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
