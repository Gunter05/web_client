import type { Horloge } from "@/shared/lib/horloge";
import { nouvelId } from "@/shared/lib/texte";
import {
  type Fait,
  type Notification,
  notificationsPour,
} from "../domain/notification";

export type DepotNotifications = {
  toutes(): Notification[];
  ajouter(notifications: Notification[]): void;
  marquerLues(destinataireId: string): void;
};

export type DepsNotifications = {
  notifications: DepotNotifications;
  horloge: Horloge;
};

export function notifier(
  deps: DepsNotifications,
  fait: Fait,
  admins: readonly string[] = [],
): void {
  const le = deps.horloge.maintenant().toISOString();
  const nouvelles = notificationsPour(fait, admins).map((b) => ({
    ...b,
    id: nouvelId(),
    lue: false,
    creeLe: le,
  }));
  if (nouvelles.length) deps.notifications.ajouter(nouvelles);
}

export function lister(deps: DepsNotifications, destinataireId: string) {
  return deps.notifications
    .toutes()
    .filter((n) => n.destinataireId === destinataireId)
    .sort((a, b) => b.creeLe.localeCompare(a.creeLe))
    .slice(0, 50);
}

export function nombreNonLues(deps: DepsNotifications, destinataireId: string) {
  return deps.notifications
    .toutes()
    .filter((n) => n.destinataireId === destinataireId && !n.lue).length;
}
