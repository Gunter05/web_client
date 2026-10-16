"use server";

import { cookies } from "next/headers";
import { COOKIE_LANGUE, estLangue } from "./langues";

/** Change la langue de l'interface et la mémorise (D2). */
export async function changerLangue(langue: string): Promise<void> {
  if (!estLangue(langue)) return;
  (await cookies()).set(COOKIE_LANGUE, langue, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
