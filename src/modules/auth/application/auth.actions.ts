"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  getCurrentAccount,
  login,
  logout,
  register,
  updateProfile,
} from "@/modules/auth/server";
import { photoUrlField } from "@/modules/medias";
import { forgetPushDevice } from "@/modules/notifications/server";
import { textField, type FormState, parseForm } from "@/shared/lib/form";
import { catchApiError } from "@/shared/api/errors";

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
  const result = await catchApiError(() =>
    register({ name: f.name, email: f.email, password: f.password }),
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

export async function updateProfileAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const account = await getCurrentAccount();
  if (!account) return { error: "loginRequired" };
  const f = parseForm(
    { name: textField(200), photoUrl: photoUrlField },
    formData,
  );
  if (!f) return { error: "invalidInput" };
  // La photo a déjà été envoyée par le navigateur : seule son adresse arrive.
  const result = await catchApiError(() =>
    updateProfile(f.name, f.photoUrl ?? account.photoUrl),
  );
  if (!result.ok) return result.state;
  revalidatePath("/", "layout");
  redirect("/profile?msg=profileSaved");
}
