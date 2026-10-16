"use server";

import { compteCourant } from "@/modules/identite/server";
import type { Notification } from "@/modules/notifications";
import {
  marquerToutesLues,
  nombreNonLues,
  notificationsDe,
} from "@/modules/notifications/server";

export async function actionCompterNotifications(): Promise<number> {
  const compte = await compteCourant();
  return compte ? nombreNonLues(compte.id) : 0;
}

export async function actionListerNotifications(): Promise<Notification[]> {
  const compte = await compteCourant();
  return compte ? notificationsDe(compte.id) : [];
}

export async function actionMarquerNotificationsLues(): Promise<void> {
  const compte = await compteCourant();
  if (compte) marquerToutesLues(compte.id);
}
