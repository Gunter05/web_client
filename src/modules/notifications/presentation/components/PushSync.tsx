"use client";

import {
  type PushActions,
  usePushNotifications,
} from "@/modules/notifications/presentation/hooks/usePushNotifications";

/**
 * Tient l'appareil à jour à chaque visite d'une personne connectée, sans rien
 * afficher : si les push sont autorisés, il se réenregistre auprès de l'API.
 */
export function PushSync({ actions }: { actions: PushActions }) {
  usePushNotifications(actions);
  return null;
}
