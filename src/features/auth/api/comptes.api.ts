import "server-only";
import { api } from "@/shared/api/client";
import type {
  Compte,
  DonneesInscription,
  ProfilPersonnel,
} from "@/features/auth/types/compte.types";

type Session = { jeton: string; compte: Compte };

/** Adaptateur HTTP du module comptes de l'API. */
export const apiComptes = {
  moi: () => api<Compte>("/api/v1/moi"),
  inscrire: (d: DonneesInscription) =>
    api<Session>("/api/v1/comptes", { corps: d, anonyme: true }),
  connecter: (email: string, motDePasse: string) =>
    api<Session>("/api/v1/sessions", {
      corps: { email, motDePasse },
      anonyme: true,
    }),
  modifierProfil: (nom: string, photo: string | null) =>
    api<Compte>("/api/v1/moi", { methode: "PATCH", corps: { nom, photo } }),
  rechercher: (recherche: string) =>
    api<ProfilPersonnel[]>(
      `/api/v1/comptes?recherche=${encodeURIComponent(recherche)}`,
    ),
};
