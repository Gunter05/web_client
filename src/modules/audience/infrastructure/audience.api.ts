import "server-only";
import { cookies, headers } from "next/headers";
import { api } from "@/shared/api/client";

/**
 * Client du module `audience` de l'API Spring (US-39). Ce module n'est pas
 * encore passé en anglais : ses routes et ses champs JSON sont traduits ici.
 */
export const audienceApi = {
  trackView: (
    eventId: string,
    v: { visitorId: string; userAgent: string | null; fromShareLink: boolean },
  ) =>
    api<void>(`/api/v1/evenements/${encodeURIComponent(eventId)}/ouvertures`, {
      body: {
        visiteurId: v.visitorId,
        agent: v.userAgent,
        viaLienPartage: v.fromShareLink,
      },
    }),
  viewCounts: (pageId: string, eventIds: readonly string[]) =>
    api<Record<string, number>>(
      `/api/v1/pages/${pageId}/vues?evenements=${eventIds.map(encodeURIComponent).join(",")}`,
    ),
};

const VISITOR_COOKIE = "contineng_visiteur";

/** Identifiant anonyme du visiteur ; à appeler depuis une Server Action (pose un cookie). */
export async function currentVisitor(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(VISITOR_COOKIE)?.value;
  if (existing) return existing;
  const id = crypto.randomUUID();
  jar.set(VISITOR_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return id;
}

export async function currentUserAgent(): Promise<string | null> {
  return (await headers()).get("user-agent");
}
