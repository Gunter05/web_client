import "server-only";
import { cache } from "react";
import { horlogeSysteme } from "@/shared/lib/horloge";
import type { Resultat } from "@/shared/lib/resultat";
import * as cas from "./application/cas-usage";
import type { DepsIdentite } from "./application/cas-usage";
import {
  type Compte,
  type DonneesInscription,
  type ProfilPersonnel,
  profilPublic,
} from "./domain/compte";
import {
  ecrireTokenSession,
  effacerTokenSession,
  lireTokenSession,
} from "./infrastructure/cookie-session";
import {
  depotComptesJson,
  depotSessionsJson,
} from "./infrastructure/depots-json";
import { hacheurScrypt } from "./infrastructure/hacheur-scrypt";

const deps: DepsIdentite = {
  comptes: depotComptesJson,
  sessions: depotSessionsJson,
  hacheur: hacheurScrypt,
  horloge: horlogeSysteme,
};

/** Compte et session de la requête courante (lus une fois par requête). */
export const sessionCourante = cache(async () =>
  cas.lireSession(deps, await lireTokenSession()),
);

export async function compteCourant(): Promise<Compte | null> {
  return (await sessionCourante())?.compte ?? null;
}

export async function inscrire(
  donnees: DonneesInscription,
): Promise<Resultat<string>> {
  const resultat = cas.inscrire(deps, donnees);
  if (resultat.ok) await ecrireTokenSession(resultat.valeur);
  return resultat;
}

export async function connecter(email: string, motDePasse: string) {
  const resultat = cas.connecter(deps, email, motDePasse);
  if (resultat.ok) await ecrireTokenSession(resultat.valeur);
  return resultat;
}

export async function deconnecter(): Promise<void> {
  const token = await lireTokenSession();
  if (token) deps.sessions.supprimer(token);
  await effacerTokenSession();
}

export const modifierProfil = (
  compteId: string,
  donnees: { nom: string; photo?: string | null },
) => cas.modifierProfil(deps, compteId, donnees);

/** Mémorise la page active dans la session (US-37). */
export function definirPageActive(token: string, pageId: string | null) {
  const session = deps.sessions.parToken(token);
  if (session) deps.sessions.modifier({ ...session, pageActiveId: pageId });
}

export function profilsParIds(
  ids: readonly string[],
): Map<string, ProfilPersonnel> {
  const voulus = new Set(ids);
  return new Map(
    deps.comptes
      .tous()
      .filter((c) => voulus.has(c.id))
      .map((c) => [c.id, profilPublic(c)]),
  );
}

export const rechercherProfils = (requete: string) =>
  cas.rechercherProfils(deps, requete);

export const idsAdmins = () =>
  deps.comptes
    .tous()
    .filter((c) => c.estAdmin)
    .map((c) => c.id);

/** Lecture brute pour l'espace Administration (US-07). */
export const tousLesComptes = () => deps.comptes.tous();
