/**
 * Noms et options des cookies de session (ADR 0018), partagés par les
 * Server Actions et par le proxy, qui ne peut pas utiliser `next/headers`.
 */
export const ACCESS_COOKIE = "contineng_access";
export const REFRESH_COOKIE = "contineng_refresh";
/** Ancien jeton de 30 jours (avant ADR 0018), effacé à la prochaine écriture. */
export const LEGACY_COOKIE = "contineng_jeton";

/** Jetons renvoyés par l'API à la connexion, à l'inscription ou au renouvellement. */
export type SessionTokens = {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
};

type CookieOptions = {
  httpOnly: true;
  sameSite: "lax";
  secure: boolean;
  path: string;
  expires: Date;
};

export function sessionCookieOptions(
  tokens: SessionTokens,
  secure: boolean,
): [string, string, CookieOptions][] {
  const base = { httpOnly: true, sameSite: "lax", secure, path: "/" } as const;
  return [
    [
      ACCESS_COOKIE,
      tokens.accessToken,
      { ...base, expires: new Date(tokens.accessTokenExpiresAt) },
    ],
    [
      REFRESH_COOKIE,
      tokens.refreshToken,
      { ...base, expires: new Date(tokens.refreshTokenExpiresAt) },
    ],
  ];
}

/**
 * Le jeton d'accès doit-il être renouvelé ? Oui s'il manque, est illisible ou
 * expire dans moins de 30 secondes. Sa signature n'est pas vérifiée ici :
 * c'est le rôle de l'API, seule l'échéance compte.
 */
export function accessTokenNeedsRefresh(
  token: string | undefined,
  now: number,
): boolean {
  if (!token) return true;
  try {
    const payload = token.split(".")[1] ?? "";
    const { exp } = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    ) as { exp?: number };
    return typeof exp !== "number" || exp * 1000 - now < 30_000;
  } catch {
    return true;
  }
}
