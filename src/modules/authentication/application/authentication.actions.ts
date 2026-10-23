"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  getCurrentAccount,
  login,
  logout,
  reactivateAccount,
  refreshNow,
  register,
  requestPasswordReset,
  resendVerification,
  resetPassword,
  revokeOtherSessions,
  revokeSession,
  suspendAccount,
  verifyEmail,
} from "@/modules/authentication/server";
import { forgetPushDevice } from "@/modules/notifications/server";
import { catchApiError, apiErrorCode } from "@/shared/api/errors";
import { currentLocale } from "@/shared/i18n/request";
import {
  idField,
  textField,
  type FormState,
  parseForm,
} from "@/shared/lib/form";

/** N'accepte qu'un chemin interne, pour éviter les redirections ouvertes. */
function internalPath(returnTo: string): string {
  return returnTo.startsWith("/") && !returnTo.startsWith("//")
    ? returnTo
    : "/";
}

export async function loginAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const f = parseForm(
    {
      email: textField(200),
      password: textField(200),
      returnTo: textField(500),
    },
    formData,
  );
  if (!f) return { error: "invalidInput" };
  const result = await catchApiError(() => login(f.email, f.password));
  if (!result.ok) return result.state;
  redirect(internalPath(f.returnTo));
}

export async function registerAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const f = parseForm(
    {
      name: textField(200),
      email: textField(200),
      password: textField(200),
      returnTo: textField(500),
    },
    formData,
  );
  if (!f) return { error: "invalidInput" };
  const language = await currentLocale();
  const result = await catchApiError(() =>
    register({ name: f.name, email: f.email, password: f.password, language }),
  );
  if (!result.ok) return result.state;
  redirect(internalPath(f.returnTo));
}

export async function logoutAction(): Promise<void> {
  // Les push suivent le compte connecté : cet appareil ne doit plus en recevoir.
  await forgetPushDevice();
  await logout();
  redirect("/");
}

/** Mot de passe oublié : même réponse que l'adresse existe ou non. */
export async function forgotPasswordAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const f = parseForm({ email: textField(200) }, formData);
  if (!f) return { error: "invalidInput" };
  const result = await catchApiError(async () =>
    requestPasswordReset(f.email, await currentLocale()),
  );
  if (!result.ok) return result.state;
  redirect("/forgot-password?msg=resetLinkSent");
}

/** Nouveau mot de passe avec le lien reçu ; toutes les sessions sont fermées. */
export async function resetPasswordAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const f = parseForm(
    { token: textField(200), password: textField(200) },
    formData,
  );
  if (!f) return { error: "invalidInput" };
  const result = await catchApiError(() => resetPassword(f.token, f.password));
  if (!result.ok) return result.state;
  await logout();
  redirect("/login?msg=passwordReset");
}

/**
 * Confirme l'adresse avec le lien reçu. Demandé par un bouton, jamais à
 * l'ouverture de la page : les messageries ouvrent parfois les liens pour les
 * analyser, ce qui consommerait le lien à l'insu de la personne.
 */
export async function verifyEmailAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const f = parseForm({ token: textField(200) }, formData);
  if (!f) return { error: "invalidInput" };
  const result = await catchApiError(() => verifyEmail(f.token));
  if (!result.ok) return result.state;
  await refreshNow();
  revalidatePath("/", "layout");
  redirect(
    (await getCurrentAccount())
      ? "/profile?msg=emailVerified"
      : "/login?msg=emailVerified",
  );
}

/** Renvoie le lien de confirmation à la personne connectée. */
export async function resendVerificationAction(): Promise<string | undefined> {
  if (!(await getCurrentAccount())) return "loginRequired";
  return apiErrorCode(async () => resendVerification(await currentLocale()));
}

/** Déconnecte un autre appareil du compte. */
export async function revokeSessionAction(
  id: string,
): Promise<string | undefined> {
  const parsed = idField.safeParse(id);
  if (!parsed.success) return "invalidInput";
  if (!(await getCurrentAccount())) return "loginRequired";
  const code = await apiErrorCode(() => revokeSession(parsed.data));
  revalidatePath("/profile");
  return code;
}

/** Déconnecte tous les autres appareils du compte. */
export async function revokeOtherSessionsAction(): Promise<string | undefined> {
  if (!(await getCurrentAccount())) return "loginRequired";
  const code = await apiErrorCode(() => revokeOtherSessions());
  revalidatePath("/profile");
  return code;
}

const suspensionSchema = z.object({
  accountId: idField,
  /** Nombre de jours, ou rien pour une suspension sans fin. */
  days: z.number().int().min(1).max(3650).nullable(),
});

/** Suspend un compte (admin) : il est déconnecté partout. L'API vérifie le rôle. */
export async function suspendAccountAction(
  accountId: string,
  days: number | null,
): Promise<string | undefined> {
  const input = suspensionSchema.safeParse({ accountId, days });
  if (!input.success) return "invalidInput";
  const account = await getCurrentAccount();
  if (!account?.isAdmin) return "accessDenied";
  const until = input.data.days
    ? new Date(Date.now() + input.data.days * 86_400_000).toISOString()
    : null;
  const code = await apiErrorCode(() =>
    suspendAccount(input.data.accountId, until),
  );
  revalidatePath("/admin/accounts");
  return code;
}

export async function reactivateAccountAction(
  accountId: string,
): Promise<string | undefined> {
  const id = idField.safeParse(accountId);
  if (!id.success) return "invalidInput";
  const account = await getCurrentAccount();
  if (!account?.isAdmin) return "accessDenied";
  const code = await apiErrorCode(() => reactivateAccount(id.data));
  revalidatePath("/admin/accounts");
  return code;
}
