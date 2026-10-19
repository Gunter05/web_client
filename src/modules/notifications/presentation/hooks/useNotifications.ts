"use client";

import { useEffect, useState } from "react";
import type { Notification } from "@/modules/notifications/domain/notification.types";

const INTERVAL_MS = 15_000;

export type NotificationActions = {
  count: () => Promise<number>;
  list: () => Promise<Notification[]>;
  markRead: () => Promise<void>;
};

/**
 * Compteur de non-lues mis à jour sans recharger la page (D8), par
 * interrogation régulière, et chargement de la liste à l'ouverture
 * (qui marque tout comme lu).
 */
export function useNotifications(
  initialUnread: number,
  actions: NotificationActions,
) {
  const [unread, setUnread] = useState(initialUnread);
  const [list, setList] = useState<Notification[] | null>(null);

  useEffect(() => {
    const id = setInterval(async () => {
      if (document.visibilityState === "visible") {
        setUnread(await actions.count());
      }
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [actions]);

  async function load() {
    setList(await actions.list());
    if (unread > 0) {
      await actions.markRead();
      setUnread(0);
    }
  }

  return { unread, list, load };
}
