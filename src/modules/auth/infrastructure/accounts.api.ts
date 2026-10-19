import "server-only";
import { api } from "@/shared/api/client";
import type {
  Account,
  PublicProfile,
  RegistrationData,
} from "@/modules/auth/domain/account.types";

// ——— Contrat du module `comptes` de l'API (encore en français) ———

type AccountResponse = {
  id: string;
  nom: string;
  email: string;
  photo: string | null;
  estAdmin: boolean;
};
type ProfileResponse = { id: string; nom: string; photo: string | null };
type SessionResponse = { jeton: string; compte: AccountResponse };

const toAccount = (a: AccountResponse): Account => ({
  id: a.id,
  name: a.nom,
  email: a.email,
  photoUrl: a.photo,
  isAdmin: a.estAdmin,
});

const toProfile = (p: ProfileResponse): PublicProfile => ({
  id: p.id,
  name: p.nom,
  photoUrl: p.photo,
});

const toSession = (s: SessionResponse) => ({
  token: s.jeton,
  account: toAccount(s.compte),
});

/**
 * Client du module `comptes` de l'API Spring. Ce module n'est pas encore
 * passé en anglais : ses champs sont convertis ici, et seulement ici.
 */
export const accountsApi = {
  me: async () => toAccount(await api<AccountResponse>("/api/v1/moi")),
  register: async (d: RegistrationData) =>
    toSession(
      await api<SessionResponse>("/api/v1/comptes", {
        body: { nom: d.name, email: d.email, motDePasse: d.password },
        anonymous: true,
      }),
    ),
  login: async (email: string, password: string) =>
    toSession(
      await api<SessionResponse>("/api/v1/sessions", {
        body: { email, motDePasse: password },
        anonymous: true,
      }),
    ),
  updateProfile: async (name: string, photoUrl: string | null) =>
    toAccount(
      await api<AccountResponse>("/api/v1/moi", {
        method: "PATCH",
        body: { nom: name, photo: photoUrl },
      }),
    ),
  search: async (query: string) =>
    (
      await api<ProfileResponse[]>(
        `/api/v1/comptes?recherche=${encodeURIComponent(query)}`,
      )
    ).map(toProfile),
};
