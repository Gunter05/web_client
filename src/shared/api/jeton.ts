import "server-only";
import { cookies } from "next/headers";

/**
 * Jeton de session (JWT émis par l'API, ADR 0009 du backend), gardé dans un
 * cookie httpOnly : le JavaScript de la page ne peut pas le lire.
 */
const NOM = "contineng_jeton";
const TRENTE_JOURS = 60 * 60 * 24 * 30;

export async function lireJeton(): Promise<string | undefined> {
  return (await cookies()).get(NOM)?.value;
}

export async function ecrireJeton(jeton: string): Promise<void> {
  (await cookies()).set(NOM, jeton, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TRENTE_JOURS,
  });
}

export async function effacerJeton(): Promise<void> {
  (await cookies()).delete(NOM);
}
