import "server-only";
import { cookies } from "next/headers";

/** Cookie de session : jeton opaque, illisible par le JavaScript de la page. */
const NOM = "contineng_session";

export async function lireTokenSession(): Promise<string | undefined> {
  return (await cookies()).get(NOM)?.value;
}

export async function ecrireTokenSession(token: string): Promise<void> {
  (await cookies()).set(NOM, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function effacerTokenSession(): Promise<void> {
  (await cookies()).delete(NOM);
}
