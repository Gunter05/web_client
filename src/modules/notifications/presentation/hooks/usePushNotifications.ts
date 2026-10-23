"use client";

import {
  onMessage,
  onRegistered,
  onUnregistered,
  register,
  unregister,
} from "firebase/messaging";
import { useLocale } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  firebaseMessaging,
  pushAvailable,
  VAPID_KEY,
} from "@/modules/notifications/presentation/push/firebase-messaging";

export type PushActions = {
  register: (fid: string, language: string) => Promise<boolean>;
  unregister: (fid: string) => Promise<void>;
};

/**
 * - `unavailable` : navigateur sans push, iPhone sans le site installé, ou
 *   Firebase non configuré ;
 * - `blocked` : refusé par la personne (seuls les réglages du navigateur
 *   permettent de revenir dessus) ;
 * - `off` / `on` : selon que cet appareil reçoit les push.
 */
export type PushState = "loading" | "unavailable" | "blocked" | "off" | "on";

/**
 * Notifications push de cet appareil (ADR 0017), par les identifiants
 * d'installation Firebase (FID) : le SDK appelle `onRegistered` à chaque
 * enregistrement et quand le FID change, ce qui tient l'API à jour sans
 * rafraîchissement périodique. Site ouvert, un push s'affiche en toast.
 */
export function usePushNotifications(actions: PushActions) {
  const language = useLocale();
  const [state, setState] = useState<PushState>("loading");

  const connect = useCallback(async () => {
    const { messaging, serviceWorkerRegistration } = await firebaseMessaging();
    onRegistered(messaging, (fid) => {
      void actions.register(fid, language).then((ok) => {
        if (ok) setState("on");
      });
    });
    onUnregistered(messaging, (fid) => {
      void actions.unregister(fid);
      setState("off");
    });
    onMessage(messaging, ({ notification }) => {
      if (notification?.title) {
        toast(notification.title, { description: notification.body });
      }
    });
    await register(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration,
    });
    return messaging;
  }, [actions, language]);

  // Au démarrage : si la permission est déjà accordée, réenregistre l'appareil.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!(await pushAvailable())) {
        if (!cancelled) setState("unavailable");
        return;
      }
      const permission = Notification.permission;
      if (cancelled) return;
      if (permission === "denied") return setState("blocked");
      if (permission !== "granted") return setState("off");
      await connect().catch(() => setState("off"));
    })();
    return () => {
      cancelled = true;
    };
  }, [connect]);

  /** Demande la permission (au clic uniquement), puis enregistre l'appareil. */
  async function enable() {
    const permission = await Notification.requestPermission();
    if (permission === "denied") return setState("blocked");
    if (permission !== "granted") return;
    setState("loading");
    await connect().catch(() => setState("off"));
  }

  /** Cet appareil ne reçoit plus de push (déclenche `onUnregistered`). */
  async function disable() {
    setState("loading");
    const { messaging } = await firebaseMessaging();
    await unregister(messaging).catch(() => setState("on"));
  }

  return { state, enable, disable };
}
