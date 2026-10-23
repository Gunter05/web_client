import "server-only";
import { api, translateApiError } from "@/shared/api/client";
import { isLocale } from "@/shared/i18n/locales";
import type {
  MyProfile,
  PublicProfile,
} from "@/modules/profiles/domain/profile.types";

// ——— Contrat du module `profiles` de l'API (ADR 0017 du backend) ———

type MyProfileResponse = {
  id: string;
  displayName: string;
  photoUrl: string | null;
  language: string;
};
type ProfileResponse = {
  id: string;
  displayName: string;
  photoUrl: string | null;
};

const toMine = (p: MyProfileResponse): MyProfile => ({
  id: p.id,
  name: p.displayName,
  photoUrl: p.photoUrl,
  language: isLocale(p.language) ? p.language : "fr",
});

const toPublic = (p: ProfileResponse): PublicProfile => ({
  id: p.id,
  name: p.displayName,
  photoUrl: p.photoUrl,
});

/** Codes et champs de l'API qui diffèrent de ceux du formulaire de profil. */
const ERROR_CODES: Record<string, string> = {
  displayNameLength: "accountNameLength",
};
const FIELDS: Record<string, string> = {
  displayName: "name",
  photoUrl: "photo",
};

/**
 * Client du module `profiles` de l'API Spring. Le front appelle « name » ce
 * que l'API appelle `displayName`.
 */
export const profilesApi = {
  mine: async () => toMine(await api<MyProfileResponse>("/api/v1/me/profile")),
  update: async (p: {
    name: string;
    photoUrl: string | null;
    language: string;
  }) => {
    try {
      return toMine(
        await api<MyProfileResponse>("/api/v1/me/profile", {
          method: "PATCH",
          body: {
            displayName: p.name,
            photoUrl: p.photoUrl,
            language: p.language,
          },
        }),
      );
    } catch (error) {
      throw translateApiError(error, ERROR_CODES, FIELDS);
    }
  },
  search: async (query: string) =>
    (
      await api<ProfileResponse[]>(
        `/api/v1/profiles?search=${encodeURIComponent(query)}`,
      )
    ).map(toPublic),
};
