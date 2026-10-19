"use server";

import type { Notification } from "@/features/notifications";
import {
  marquerToutesLues,
  nombreNonLues,
  notificationsRecentes,
} from "@/features/notifications/server";
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
