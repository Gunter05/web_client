"use client";

import { useState } from "react";
import type { Notification } from "@/modules/notifications/domain/notification.types";

export type NotificationActions = {
  list: () => Promise<Notification[]>;
  markRead: () => Promise<void>;
};

/**
 * Compteur de non-lues lu au rendu serveur : il se met à jour au chargement
 * de la page (ou `router.refresh()`), sans interrogation régulière qui
 * multiplierait les requêtes. La liste se charge à l'ouverture (qui marque
 * tout comme lu).
 */
export function useNotifications(
  initialUnread: number,
  actions: NotificationActions,
) {
  const [unread, setUnread] = useState(initialUnread);
  const [list, setList] = useState<Notification[] | null>(null);
  // Nouveau rendu serveur (rafraîchissement) : on reprend sa valeur.
  const [previousInitial, setPreviousInitial] = useState(initialUnread);
  if (initialUnread !== previousInitial) {
    setPreviousInitial(initialUnread);
    setUnread(initialUnread);
  }

  async function load() {
    setList(await actions.list());
    if (unread > 0) {
      await actions.markRead();
      setUnread(0);
    }
  }

  return { unread, list, load };
}
