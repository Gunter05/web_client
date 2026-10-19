"use server";

import { cookies } from "next/headers";
import { LOCALE_COOKIE, isLocale } from "@/shared/i18n/locales";

/** Change la langue de l'interface et la mémorise (D2). */
export async function changeLocale(locale: string): Promise<void> {
  if (!isLocale(locale)) return;
  (await cookies()).set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
