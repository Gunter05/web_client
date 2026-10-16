import "server-only";
import { collection } from "@/shared/stockage/collection-json";
import type { DepotNotifications } from "../application/cas-usage";
import type { Notification } from "../domain/notification";

const notifications = collection<Notification>("notifications", () => []);

export const depotNotificationsJson: DepotNotifications = {
  toutes: () => notifications.tous(),
  ajouter: (nouvelles) => notifications.muter((l) => [...l, ...nouvelles]),
  marquerLues: (id) =>
    notifications.muter((l) =>
      l.map((n) => (n.destinataireId === id ? { ...n, lue: true } : n)),
    ),
};
