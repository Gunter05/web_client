"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  getMyProfile,
  saveLanguage,
  updateProfile,
} from "@/modules/profiles/server";
import { photoUrlField } from "@/modules/medias";
import { catchApiError } from "@/shared/api/errors";
import { readToken } from "@/shared/api/token";
import { changeLocale } from "@/shared/i18n/actions";
import { isLocale } from "@/shared/i18n/locales";
import { textField, type FormState, parseForm } from "@/shared/lib/form";

export async function updateProfileAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await readToken())) return { error: "loginRequired" };
  const f = parseForm(
    { name: textField(200), photoUrl: photoUrlField },
    formData,
  );
  if (!f) return { error: "invalidInput" };
  const result = await catchApiError(async () => {
    const current = await getMyProfile();
    // La photo a déjà été envoyée par le navigateur : seule son adresse arrive.
    return updateProfile(
      f.name,
      f.photoUrl ?? current.photoUrl,
      current.language,
    );
  });
  if (!result.ok) return result.state;
  revalidatePath("/", "layout");
  redirect("/profile?msg=profileSaved");
}

/**
 * Change la langue de l'interface et, pour une personne connectée, la garde
 * dans son profil : elle la retrouve sur tous ses appareils.
 */
export async function changeLanguageAction(locale: string): Promise<void> {
  if (!isLocale(locale)) return;
  await changeLocale(locale);
  await saveLanguage(locale);
}
