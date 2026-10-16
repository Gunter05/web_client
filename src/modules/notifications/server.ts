import "server-only";
import { horlogeSysteme } from "@/shared/lib/horloge";
import * as cas from "./application/cas-usage";
import type { Fait } from "./domain/notification";
import { depotNotificationsJson } from "./infrastructure/depot-json";

const deps: cas.DepsNotifications = {
  notifications: depotNotificationsJson,
  horloge: horlogeSysteme,
};

/** `admins` : destinataires des faits réservés à l'équipe (nouvelle demande). */
export const notifier = (fait: Fait, admins: readonly string[] = []) =>
  cas.notifier(deps, fait, admins);
export const notificationsDe = (compteId: string) => cas.lister(deps, compteId);
export const nombreNonLues = (compteId: string) =>
  cas.nombreNonLues(deps, compteId);
export const marquerToutesLues = (compteId: string) =>
  deps.notifications.marquerLues(compteId);
