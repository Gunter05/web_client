"use server";

import type { Notification } from "@/modules/notifications";
import {
  marquerToutesLues,
  nombreNonLues,
  notificationsRecentes,
} from "@/modules/notifications/server";
import { lireJeton } from "@/shared/api/jeton";

export async function actionCompterNotifications(): Promise<number> {
  if (!(await lireJeton())) return 0;
  return nombreNonLues();
}

export async function actionListerNotifications(): Promise<Notification[]> {
  if (!(await lireJeton())) return [];
  return notificationsRecentes();
}

export async function actionMarquerNotificationsLues(): Promise<void> {
  if (await lireJeton()) await marquerToutesLues();
}
