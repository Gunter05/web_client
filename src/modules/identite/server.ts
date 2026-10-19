import "server-only";
import { cache } from "react";
import { ErreurApi } from "@/shared/api/client";
import { ecrireJeton, effacerJeton, lireJeton } from "@/shared/api/jeton";
import type {
  Compte,
  DonneesInscription,
  ProfilPersonnel,
} from "./domain/compte";
import { apiComptes } from "./infrastructure/api-comptes";

/**
 * Compte connecté pour la requête courante, ou `null` (visiteur). Un jeton
 * expiré ou invalide est traité comme une absence de connexion.
 */
export const compteCourant = cache(async (): Promise<Compte | null> => {
  if (!(await lireJeton())) return null;
  try {
    return await apiComptes.moi();
  } catch (erreur) {
    if (erreur instanceof ErreurApi && erreur.statut === 401) return null;
    throw erreur;
  }
});

export async function inscrire(d: DonneesInscription): Promise<Compte> {
  const { jeton, compte } = await apiComptes.inscrire(d);
  await ecrireJeton(jeton);
  return compte;
}

export async function connecter(
  email: string,
  motDePasse: string,
): Promise<Compte> {
  const { jeton, compte } = await apiComptes.connecter(email, motDePasse);
  await ecrireJeton(jeton);
  return compte;
}

export async function deconnecter(): Promise<void> {
  await effacerJeton();
}

export const modifierProfil = (nom: string, photo: string | null) =>
  apiComptes.modifierProfil(nom, photo);

/** US-06 : nom (3 caractères min) ou e-mail exact ; jamais d'e-mail en retour. */
export const rechercherProfils = (
  recherche: string,
): Promise<ProfilPersonnel[]> => apiComptes.rechercher(recherche);
