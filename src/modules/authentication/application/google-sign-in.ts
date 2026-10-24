import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection, type NextRequest } from "next/server";
import { z } from "zod";
import { completeSignIn } from "@/modules/authentication/server";
import { internalPath } from "@/modules/authentication/domain/return-path";
import { authenticationApi } from "@/modules/authentication/infrastructure/authentication.api";
import {
  exchangeGoogleCode,
  googleAuthorizationUrl,
  isGoogleConfigured,
  randomSecret,
} from "@/modules/authentication/infrastructure/google";
import { ApiError } from "@/shared/api/client";
import { env } from "@/shared/config/env";
import { currentLocale } from "@/shared/i18n/request";

/**
 * Connexion avec Google (ADR 0019 du backend), en deux routes :
 * `/auth/google` part chez Google, `/auth/google/callback` en revient. Le
 * state, le nonce et le vérificateur PKCE vivent 10 minutes dans un cookie
 * httpOnly limité à ces deux routes.
 */
const FLOW_COOKIE = "contineng_google";
const FLOW_PATH = "/auth/google";

const flowSchema = z.object({
  state: z.string().min(20).max(100),
  nonce: z.string().min(20).max(100),
  verifier: z.string().min(43).max(128),
  returnTo: z.string().max(500),
});

const callbackSchema = z.object({
  state: z.string().min(1).max(200),
  code: z.string().min(1).max(2000),
});

/** Erreurs de l'API affichées telles quelles sur /login ; les autres : échec générique. */
const KNOWN_ERRORS = new Set([
  "accountSuspended",
  "googleEmailNotVerified",
  "googleSignInUnavailable",
]);

function redirectUri(request: NextRequest): string {
  return `${request.nextUrl.origin}${FLOW_PATH}/callback`;
}

/** Retour sur /login avec le message ; la raison est journalisée (logs Vercel). */
function failed(reason: string, code = "googleFailed"): never {
  console.warn(`[google-sign-in] échec : ${reason}`);
  redirect(`/login?error=${code}`);
}

export async function startGoogleSignIn(request: NextRequest): Promise<never> {
  // À chaque requête : un state neuf, et la configuration lue au démarrage, pas au build
  await connection();
  if (!isGoogleConfigured()) {
    failed(
      "GOOGLE_CLIENT_ID ou GOOGLE_CLIENT_SECRET absent",
      "googleSignInUnavailable",
    );
  }
  const flow = {
    state: randomSecret(),
    nonce: randomSecret(),
    verifier: randomSecret(),
    returnTo: internalPath(request.nextUrl.searchParams.get("returnTo")),
  };
  (await cookies()).set(
    FLOW_COOKIE,
    Buffer.from(JSON.stringify(flow)).toString("base64url"),
    {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      // Le retour de Google est une navigation venue d'un autre site : Lax l'autorise.
      sameSite: "lax",
      path: FLOW_PATH,
      maxAge: 600,
    },
  );
  redirect(
    await googleAuthorizationUrl({
      ...flow,
      redirectUri: redirectUri(request),
    }),
  );
}

export async function finishGoogleSignIn(request: NextRequest): Promise<never> {
  const store = await cookies();
  const raw = store.get(FLOW_COOKIE)?.value;
  store.delete({ name: FLOW_COOKIE, path: FLOW_PATH });
  const flow = parseFlow(raw);
  const callback = callbackSchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  );
  // Refus de la personne chez Google, retour sans cookie ou state différent (CSRF)
  const googleError = request.nextUrl.searchParams.get("error");
  if (googleError) failed(`Google a renvoyé l'erreur « ${googleError} »`);
  if (!flow)
    failed("cookie du flux absent ou illisible (délai de 10 min dépassé ?)");
  if (!callback.success) failed("paramètres de retour invalides");
  if (callback.data.state !== flow.state) failed("state différent (CSRF ?)");
  const idToken = await exchangeGoogleCode({
    code: callback.data.code,
    redirectUri: redirectUri(request),
    verifier: flow.verifier,
  }).catch(() => null);
  if (!idToken) failed("pas de jeton d'identité (échange du code refusé)");
  try {
    await completeSignIn(
      await authenticationApi.signInWithGoogle(
        idToken,
        flow.nonce,
        await currentLocale(),
      ),
    );
  } catch (error) {
    if (error instanceof ApiError && KNOWN_ERRORS.has(error.code)) {
      failed(`refus de l'API (${error.code})`, error.code);
    }
    failed(
      error instanceof ApiError
        ? `refus de l'API (${error.status} ${error.code}) : jeton refusé, vérifier GOOGLE_CLIENT_ID de l'API`
        : `API injoignable : ${String(error)}`,
    );
  }
  redirect(flow.returnTo);
}

function parseFlow(raw: string | undefined): z.infer<typeof flowSchema> | null {
  if (!raw) return null;
  try {
    const parsed = flowSchema.safeParse(
      JSON.parse(Buffer.from(raw, "base64url").toString("utf8")),
    );
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
