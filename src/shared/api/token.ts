import "server-only";
import { cookies } from "next/headers";
import { env } from "@/shared/config/env";
import {
  ACCESS_COOKIE,
  LEGACY_COOKIE,
  REFRESH_COOKIE,
  type SessionTokens,
  sessionCookieOptions,
} from "@/shared/api/session-cookies";

/**
 * Session de la personne connectée (ADR 0018) : jeton d'accès (15 min) et
 * jeton de renouvellement (60 jours), émis par l'API et gardés dans des
 * cookies httpOnly — le JavaScript de la page ne peut pas les lire. Le
 * renouvellement se fait dans `src/proxy.ts`, avant le rendu des pages.
 */
export async function readToken(): Promise<string | undefined> {
  return (await cookies()).get(ACCESS_COOKIE)?.value;
}

export async function readRefreshToken(): Promise<string | undefined> {
  return (await cookies()).get(REFRESH_COOKIE)?.value;
}

export async function writeSession(tokens: SessionTokens): Promise<void> {
  const store = await cookies();
  const secure = env.NODE_ENV === "production";
  for (const [name, value, options] of sessionCookieOptions(tokens, secure)) {
    store.set(name, value, options);
  }
  store.delete(LEGACY_COOKIE);
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
  store.delete(LEGACY_COOKIE);
}
