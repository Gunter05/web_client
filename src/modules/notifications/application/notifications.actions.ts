"use server";

import type { Notification } from "@/modules/notifications";
import { z } from "zod";
import { INSTALLATION_ID } from "@/modules/notifications/domain/push";
import {
  markAllRead,
  countUnread,
  getRecentNotifications,
  registerPushDevice,
  unregisterPushDevice,
} from "@/modules/notifications/server";
import { readToken } from "@/shared/api/token";
import { LOCALES } from "@/shared/i18n/locales";

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

const installationId = z.string().regex(INSTALLATION_ID);

/**
 * Ce navigateur reçoit désormais les push du compte connecté (ADR 0017).
 * Appelé à chaque démarrage par le SDK Firebase, ce qui garde l'appareil
 * actif côté API. Sans session, rien n'est enregistré.
 */
export async function registerPushDeviceAction(
  fid: string,
  language: string,
): Promise<boolean> {
  const f = z
    .object({ fid: installationId, language: z.enum(LOCALES) })
    .safeParse({ fid, language });
  if (!f.success || !(await readToken())) return false;
  // Refus possible : adresse e-mail non confirmée (403 emailNotVerified).
  return registerPushDevice(f.data.fid, f.data.language).then(
    () => true,
    () => false,
  );
}

/** Ce navigateur ne reçoit plus les push du compte connecté. */
export async function unregisterPushDeviceAction(fid: string): Promise<void> {
  const f = installationId.safeParse(fid);
  if (f.success && (await readToken())) await unregisterPushDevice(f.data);
}
