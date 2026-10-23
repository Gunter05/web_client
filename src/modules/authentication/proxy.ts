import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/shared/config/env";
import {
  ACCESS_COOKIE,
  LEGACY_COOKIE,
  REFRESH_COOKIE,
  type SessionTokens,
  accessTokenNeedsRefresh,
  sessionCookieOptions,
} from "@/shared/api/session-cookies";

/**
 * Renouvelle la session avant le rendu d'une page ou d'une Server Action
 * (ADR 0018) : si le jeton d'accès manque ou expire bientôt et qu'un jeton de
 * renouvellement existe, l'API donne un nouveau couple. Les cookies sont mis à
 * jour sur la réponse (navigateur) et sur la requête (rendu en cours). Si l'API
 * refuse (session révoquée, compte suspendu), la session est effacée.
 *
 * Point d'entrée du module réservé à `src/proxy.ts`.
 */
export async function refreshSession(
  request: NextRequest,
): Promise<NextResponse> {
  request.cookies.delete(LEGACY_COOKIE);
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
  const access = request.cookies.get(ACCESS_COOKIE)?.value;
  if (!refresh || !accessTokenNeedsRefresh(access, Date.now())) {
    return NextResponse.next();
  }
  const tokens = await exchange(refresh);
  if (tokens === "unavailable") return NextResponse.next();
  if (!tokens) {
    request.cookies.delete(ACCESS_COOKIE);
    request.cookies.delete(REFRESH_COOKIE);
    const response = NextResponse.next({
      request: { headers: request.headers },
    });
    response.cookies.delete(ACCESS_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
    return response;
  }
  const cookies = sessionCookieOptions(tokens, env.NODE_ENV === "production");
  for (const [name, value] of cookies) request.cookies.set(name, value);
  const response = NextResponse.next({ request: { headers: request.headers } });
  for (const [name, value, options] of cookies)
    response.cookies.set(name, value, options);
  return response;
}

/** Nouveaux jetons ; `null` si la session est finie ; « indisponible » si l'API ne répond pas. */
async function exchange(
  refreshToken: string,
): Promise<SessionTokens | null | "unavailable"> {
  try {
    const response = await fetch(
      `${env.API_URL}/api/v1/auth/sessions/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ refreshToken }),
        cache: "no-store",
      },
    );
    if (response.status === 401 || response.status === 403) return null;
    if (!response.ok) return "unavailable";
    return (await response.json()) as SessionTokens;
  } catch {
    return "unavailable";
  }
}
