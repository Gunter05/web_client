import "server-only";
import { cache } from "react";
import { ApiError } from "@/shared/api/client";
import {
  clearSession,
  readRefreshToken,
  readToken,
  writeSession,
} from "@/shared/api/token";
import { changeLocale } from "@/shared/i18n/actions";
import { getMyProfile } from "@/modules/profiles/server";
import type {
  Account,
  DeviceSession,
  RegistrationData,
} from "@/modules/authentication/domain/authentication.types";
import { authenticationApi } from "@/modules/authentication/infrastructure/authentication.api";

export type {
  Account,
  DeviceSession,
} from "@/modules/authentication/domain/authentication.types";

/**
 * La personne connectée pour la requête courante (compte + profil), ou `null`
 * (visiteur). Une session expirée, révoquée ou suspendue compte comme une
 * absence de connexion.
 */
export const getCurrentAccount = cache(async (): Promise<Account | null> => {
  if (!(await readToken())) return null;
  try {
    const [account, profile] = await Promise.all([
      authenticationApi.me(),
      getMyProfile(),
    ]);
    return {
      id: account.id,
      email: account.email,
      emailVerified: account.emailVerified,
      isAdmin: account.role === "admin",
      name: profile.name,
      photoUrl: profile.photoUrl,
      language: profile.language,
    };
  } catch (error) {
    if (error instanceof ApiError && [401, 403, 404].includes(error.status)) {
      return null;
    }
    throw error;
  }
});

export async function register(d: RegistrationData): Promise<void> {
  const tokens = await authenticationApi.register({
    email: d.email,
    password: d.password,
    displayName: d.name,
    language: d.language,
  });
  await writeSession(tokens);
}

/** Connexion ; l'interface prend ensuite la langue du profil. */
export async function login(email: string, password: string): Promise<void> {
  await writeSession(await authenticationApi.signIn(email, password));
  const profile = await getMyProfile().catch(() => null);
  if (profile) await changeLocale(profile.language);
}

/** Déconnexion de cet appareil : la session est révoquée côté API. */
export async function logout(): Promise<void> {
  await authenticationApi.signOut().catch(() => undefined);
  await clearSession();
}

export const listSessions = (): Promise<DeviceSession[]> =>
  authenticationApi.sessions();
export const revokeSession = authenticationApi.revokeSession;
export const revokeOtherSessions = authenticationApi.revokeOtherSessions;
export const verifyEmail = authenticationApi.verifyEmail;
export const resendVerification = authenticationApi.resendVerification;
export const requestPasswordReset = authenticationApi.requestPasswordReset;
export const resetPassword = authenticationApi.resetPassword;
export const suspendAccount = authenticationApi.suspend;
export const reactivateAccount = authenticationApi.reactivate;

/**
 * Après la confirmation de l'adresse : nouveau jeton d'accès tout de suite,
 * pour que les actions réservées s'ouvrent sans attendre 15 minutes.
 */
export async function refreshNow(): Promise<void> {
  const refreshToken = await readRefreshToken();
  if (!refreshToken) return;
  const tokens = await authenticationApi
    .refresh(refreshToken)
    .catch(() => null);
  if (tokens) await writeSession(tokens);
}
