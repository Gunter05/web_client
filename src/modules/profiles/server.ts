import "server-only";
import { cache } from "react";
import { readToken } from "@/shared/api/token";
import type { Locale } from "@/shared/i18n/locales";
import type {
  MyProfile,
  PublicProfile,
} from "@/modules/profiles/domain/profile.types";
import { profilesApi } from "@/modules/profiles/infrastructure/profiles.api";

export type {
  MyProfile,
  PublicProfile,
} from "@/modules/profiles/domain/profile.types";

/** Son propre profil, lu une fois par requête. */
export const getMyProfile = cache((): Promise<MyProfile> => profilesApi.mine());

export const updateProfile = (
  name: string,
  photoUrl: string | null,
  language: Locale,
) => profilesApi.update({ name, photoUrl, language });

/** US-06 : nom (3 caractères min) ou e-mail exact ; jamais d'e-mail en retour. */
export const searchProfiles = (query: string): Promise<PublicProfile[]> =>
  profilesApi.search(query);

/** Enregistre la langue choisie dans le profil, si la personne est connectée. */
export async function saveLanguage(language: Locale): Promise<void> {
  if (!(await readToken())) return;
  const profile = await profilesApi.mine().catch(() => null);
  if (!profile || profile.language === language) return;
  await profilesApi.update({ ...profile, language }).catch(() => undefined);
}
