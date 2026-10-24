import "server-only";
import { env } from "@/shared/config/env";

/**
 * Connexion avec Google côté serveur (ADR 0019 du backend) : flux « code
 * d'autorisation » avec PKCE, state et nonce. Le front n'obtient de Google
 * que le jeton d'identité, que l'API vérifie avant d'ouvrir une session.
 */
const AUTHORIZE_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

export function isGoogleConfigured(): boolean {
  return env.GOOGLE_CLIENT_ID !== "" && env.GOOGLE_CLIENT_SECRET !== "";
}

/** Valeur aléatoire en base64url (state, nonce, vérificateur PKCE). */
export function randomSecret(): string {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString(
    "base64url",
  );
}

async function codeChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier),
  );
  return Buffer.from(digest).toString("base64url");
}

export async function googleAuthorizationUrl(flow: {
  redirectUri: string;
  state: string;
  nonce: string;
  verifier: string;
}): Promise<string> {
  const url = new URL(AUTHORIZE_URL);
  url.search = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: flow.redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state: flow.state,
    nonce: flow.nonce,
    code_challenge: await codeChallenge(flow.verifier),
    code_challenge_method: "S256",
    prompt: "select_account",
  }).toString();
  return url.toString();
}

/**
 * Échange le code reçu contre le jeton d'identité ; `null` si Google refuse
 * (la raison donnée par Google est journalisée, jamais le secret).
 */
export async function exchangeGoogleCode(flow: {
  code: string;
  redirectUri: string;
  verifier: string;
}): Promise<string | null> {
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: flow.code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: flow.redirectUri,
      grant_type: "authorization_code",
      code_verifier: flow.verifier,
    }),
    cache: "no-store",
  });
  if (!response.ok) {
    const refusal = (await response.json().catch(() => ({}))) as {
      error?: string;
      error_description?: string;
    };
    console.warn(
      `[google-sign-in] échange du code refusé (${response.status}) :`,
      refusal.error,
      refusal.error_description,
    );
    return null;
  }
  const body = (await response.json()) as { id_token?: unknown };
  return typeof body.id_token === "string" ? body.id_token : null;
}
