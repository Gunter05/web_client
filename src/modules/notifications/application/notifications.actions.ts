"use server";

import type { Notification } from "@/modules/notifications";
import {
  markAllRead,
  countUnread,
  getRecentNotifications,
} from "@/modules/notifications/server";
import { readToken } from "@/shared/api/token";

export async function countNotificationsAction(): Promise<number> {
  if (!(await readToken())) return 0;
  return countUnread();
}

export async function listNotificationsAction(): Promise<Notification[]> {
  if (!(await readToken())) return [];
  return getRecentNotifications();
}

export async function markNotificationsReadAction(): Promise<void> {
  if (await readToken()) await markAllRead();
}
