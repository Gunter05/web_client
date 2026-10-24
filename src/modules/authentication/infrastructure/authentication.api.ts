import "server-only";
import { api } from "@/shared/api/client";
import type { SessionTokens } from "@/shared/api/session-cookies";
import type { DeviceSession } from "@/modules/authentication/domain/authentication.types";
import { withTranslatedErrors } from "@/modules/authentication/infrastructure/errors";

/** Le compte connecté, tel que le module `authentication` de l'API le décrit. */
export type AccountResponse = {
  id: string;
  email: string;
  emailVerified: boolean;
  role: "user" | "admin";
};

type TokensResponse = SessionTokens & { account: AccountResponse };

/**
 * Client du module `authentication` de l'API Spring (ADR 0017 du backend).
 * Les types reprennent exactement son contrat.
 */
export const authenticationApi = {
  register: (body: {
    email: string;
    password: string;
    displayName: string;
    language: string;
  }) =>
    withTranslatedErrors(() =>
      api<TokensResponse>("/api/v1/auth/registrations", {
        body,
        anonymous: true,
        forwardClient: true,
      }),
    ),
  signIn: (email: string, password: string) =>
    withTranslatedErrors(() =>
      api<TokensResponse>("/api/v1/auth/sessions", {
        body: { email, password },
        anonymous: true,
        forwardClient: true,
      }),
    ),
  /** Connexion (ou inscription) avec un jeton d'identité Google (ADR 0019). */
  signInWithGoogle: (idToken: string, nonce: string, language: string) =>
    withTranslatedErrors(() =>
      api<TokensResponse>("/api/v1/auth/google", {
        body: { idToken, nonce, language },
        anonymous: true,
        forwardClient: true,
      }),
    ),
  refresh: (refreshToken: string) =>
    api<TokensResponse>("/api/v1/auth/sessions/refresh", {
      body: { refreshToken },
      anonymous: true,
    }),
  signOut: () =>
    api<void>("/api/v1/auth/sessions/current", { method: "DELETE" }),
  me: () => api<AccountResponse>("/api/v1/me/account"),
  sessions: () => api<DeviceSession[]>("/api/v1/me/sessions"),
  revokeSession: (id: string) =>
    withTranslatedErrors(() =>
      api<void>(`/api/v1/me/sessions/${encodeURIComponent(id)}`, {
        method: "DELETE",
      }),
    ),
  revokeOtherSessions: () =>
    api<void>("/api/v1/me/sessions", { method: "DELETE" }),
  verifyEmail: (token: string) =>
    withTranslatedErrors(() =>
      api<void>("/api/v1/auth/email-verification", {
        body: { token },
        anonymous: true,
      }),
    ),
  resendVerification: (language: string) =>
    withTranslatedErrors(() =>
      api<void>("/api/v1/me/email-verification", { body: { language } }),
    ),
  requestPasswordReset: (email: string, language: string) =>
    withTranslatedErrors(() =>
      api<void>("/api/v1/auth/password-reset", {
        body: { email, language },
        anonymous: true,
      }),
    ),
  resetPassword: (token: string, password: string) =>
    withTranslatedErrors(() =>
      api<void>("/api/v1/auth/password-reset/confirmation", {
        body: { token, password },
        anonymous: true,
      }),
    ),
  suspend: (accountId: string, until: string | null) =>
    withTranslatedErrors(() =>
      api<void>(
        `/api/v1/admin/accounts/${encodeURIComponent(accountId)}/suspension`,
        {
          method: "PUT",
          body: { until },
        },
      ),
    ),
  reactivate: (accountId: string) =>
    withTranslatedErrors(() =>
      api<void>(
        `/api/v1/admin/accounts/${encodeURIComponent(accountId)}/suspension`,
        {
          method: "DELETE",
        },
      ),
    ),
};
