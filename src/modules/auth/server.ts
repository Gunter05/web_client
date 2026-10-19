import "server-only";
import { cache } from "react";
import { ApiError } from "@/shared/api/client";
import { writeToken, clearToken, readToken } from "@/shared/api/token";
import type {
  Account,
  RegistrationData,
  PublicProfile,
} from "@/modules/auth/domain/account.types";
import { accountsApi } from "@/modules/auth/infrastructure/accounts.api";

/**
 * Compte connecté pour la requête courante, ou `null` (visiteur). Un jeton
 * expiré ou invalide est traité comme une absence de connexion.
 */
export const getCurrentAccount = cache(async (): Promise<Account | null> => {
  if (!(await readToken())) return null;
  try {
    return await accountsApi.me();
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
});

export async function register(d: RegistrationData): Promise<Account> {
  const { token, account } = await accountsApi.register(d);
  await writeToken(token);
  return account;
}

export async function login(email: string, password: string): Promise<Account> {
  const { token, account } = await accountsApi.login(email, password);
  await writeToken(token);
  return account;
}

export async function logout(): Promise<void> {
  await clearToken();
}

export const updateProfile = (name: string, photoUrl: string | null) =>
  accountsApi.updateProfile(name, photoUrl);

/** US-06 : nom (3 caractères min) ou e-mail exact ; jamais d'e-mail en retour. */
export const searchProfiles = (query: string): Promise<PublicProfile[]> =>
  accountsApi.search(query);
