import "server-only";
import { cookies, headers } from "next/headers";
import { api } from "@/shared/api/client";

/** Adaptateur HTTP du module audience de l'API (US-39). */
export const apiAudience = {
  ouverture: (
    evenementId: string,
    o: { visiteurId: string; agent: string | null; viaLienPartage: boolean },
  ) =>
    api<void>(
      `/api/v1/evenements/${encodeURIComponent(evenementId)}/ouvertures`,
      {
        corps: o,
      },
    ),
  vues: (pageId: string, evenementIds: readonly string[]) =>
    api<Record<string, number>>(
      `/api/v1/pages/${pageId}/vues?evenements=${evenementIds.map(encodeURIComponent).join(",")}`,
    ),
};

const COOKIE_VISITEUR = "contineng_visiteur";

/** Identifiant anonyme du visiteur ; à appeler depuis une Server Action (pose un cookie). */
export async function visiteurCourant(): Promise<string> {
  const jar = await cookies();
  const existant = jar.get(COOKIE_VISITEUR)?.value;
  if (existant) return existant;
  const id = crypto.randomUUID();
  jar.set(COOKIE_VISITEUR, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return id;
}

export async function userAgentCourant(): Promise<string | null> {
  return (await headers()).get("user-agent");
}
