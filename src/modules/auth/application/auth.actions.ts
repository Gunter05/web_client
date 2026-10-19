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
import { uploadImage } from "@/shared/api/client";
import {
  fileField,
  textField,
  type FormState,
  parseForm,
} from "@/shared/lib/form";
import { checkImage } from "@/shared/lib/images";
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
  await logout();
  redirect("/");
}

export async function updateProfileAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const account = await getCurrentAccount();
  if (!account) return { error: "loginRequired" };
  const f = parseForm({ name: textField(200), photo: fileField }, formData);
  if (!f) return { error: "invalidInput" };
  if (f.photo) {
    const error = checkImage(f.photo);
    if (error) return { fieldErrors: { photo: error } };
  }
  const result = await catchApiError(async () =>
    updateProfile(
      f.name,
      f.photo ? await uploadImage(f.photo) : account.photoUrl,
    ),
  );
  if (!result.ok) return result.state;
  revalidatePath("/", "layout");
  redirect("/profile?msg=profileSaved");
}
