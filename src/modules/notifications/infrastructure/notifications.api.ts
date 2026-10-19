import "server-only";
import { api } from "@/shared/api/client";
import type {
  Notification,
  NotificationType,
} from "@/modules/notifications/domain/notification.types";

// ——— Contrat du module `notifications` de l'API (encore en français) ———

type NotificationResponse = {
  id: string;
  type: string;
  parametres: Record<string, string>;
  lien: string | null;
  lue: boolean;
  creeLe: string;
};

const TYPES: Record<string, NotificationType> = {
  pageCreee: "pageCreated",
  demandeRefusee: "requestRejected",
  accesDonne: "accessGranted",
  accesRetire: "accessRevoked",
  nouvelleDemande: "newRequest",
};

/** Paramètres des messages : noms de l'API → noms du catalogue (`{name}`, `{reason}`). */
const PARAMS: Record<string, string> = { nom: "name", motif: "reason" };

const toNotification = (n: NotificationResponse): Notification | null => {
  const type = TYPES[n.type];
  if (!type) return null;
  return {
    id: n.id,
    type,
    params: Object.fromEntries(
      Object.entries(n.parametres).map(([k, v]) => [PARAMS[k] ?? k, v]),
    ),
    link: n.lien,
    read: n.lue,
    createdAt: n.creeLe,
  };
};

/**
 * Client du module `notifications` de l'API Spring. Ce module n'est pas
 * encore passé en anglais : ses champs et ses types sont convertis ici.
 * Un type inconnu du front est ignoré plutôt que d'afficher une clé brute.
 */
export const notificationsApi = {
  recent: async () =>
    (await api<NotificationResponse[]>("/api/v1/moi/notifications"))
      .map(toNotification)
      .filter((n): n is Notification => n !== null),
  unreadCount: async () =>
    (await api<{ nonLues: number }>("/api/v1/moi/notifications/non-lues"))
      .nonLues,
  markAllRead: () =>
    api<void>("/api/v1/moi/notifications/lecture", { method: "POST" }),
};
