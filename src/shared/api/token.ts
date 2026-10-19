import "server-only";
import { cookies } from "next/headers";
import { env } from "@/shared/config/env";

/**
 * Jeton de session (JWT émis par l'API, ADR 0009 du backend), gardé dans un
 * cookie httpOnly : le JavaScript de la page ne peut pas le lire.
 */
const NAME = "contineng_jeton";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function readToken(): Promise<string | undefined> {
  return (await cookies()).get(NAME)?.value;
}

export async function writeToken(token: string): Promise<void> {
  (await cookies()).set(NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
    maxAge: THIRTY_DAYS,
  });
}

export async function clearToken(): Promise<void> {
  (await cookies()).delete(NAME);
}
