import type { Horloge } from "@/shared/lib/horloge";
import {
  echec,
  echecChamps,
  type Resultat,
  succes,
} from "@/shared/lib/resultat";
import { nouvelId } from "@/shared/lib/texte";
import {
  type Compte,
  type DonneesInscription,
  erreursInscription,
  erreursNom,
  normaliserEmail,
  type ProfilPersonnel,
  profilPublic,
} from "../domain/compte";
import type { DepotComptes, DepotSessions, Hacheur, Session } from "./ports";

export type DepsIdentite = {
  comptes: DepotComptes;
  sessions: DepotSessions;
  hacheur: Hacheur;
  horloge: Horloge;
};

function ouvrirSession(deps: DepsIdentite, compteId: string): string {
  const token = `${nouvelId()}${nouvelId()}`.replaceAll("-", "");
  // US-37 : après chaque connexion, le profil actif est le profil personnel.
  deps.sessions.ajouter({
    token,
    compteId,
    pageActiveId: null,
    creeLe: deps.horloge.maintenant().toISOString(),
  });
  return token;
}

export function inscrire(
  deps: DepsIdentite,
  donnees: DonneesInscription,
): Resultat<string> {
  const champs = erreursInscription(donnees);
  if (Object.keys(champs).length) return echecChamps(champs);
  const email = normaliserEmail(donnees.email);
  if (deps.comptes.parEmail(email)) {
    return echecChamps({ email: "emailDejaUtilise" });
  }
  const compte: Compte = {
    id: nouvelId(),
    nom: donnees.nom.trim(),
    email,
    photo: null,
    motDePasseHash: deps.hacheur.hacher(donnees.motDePasse),
    estAdmin: false,
    creeLe: deps.horloge.maintenant().toISOString(),
  };
  deps.comptes.ajouter(compte);
  return succes(ouvrirSession(deps, compte.id));
}

export function connecter(
  deps: DepsIdentite,
  email: string,
  motDePasse: string,
): Resultat<string> {
  const compte = deps.comptes.parEmail(normaliserEmail(email));
  if (!compte || !deps.hacheur.verifier(motDePasse, compte.motDePasseHash)) {
    return echec("identifiantsInvalides");
  }
  return succes(ouvrirSession(deps, compte.id));
}

export type CompteConnecte = { compte: Compte; session: Session };

export function lireSession(
  deps: DepsIdentite,
  token: string | undefined,
): CompteConnecte | null {
  if (!token) return null;
  const session = deps.sessions.parToken(token);
  if (!session) return null;
  const compte = deps.comptes.parId(session.compteId);
  return compte ? { compte, session } : null;
}

export function modifierProfil(
  deps: DepsIdentite,
  compteId: string,
  donnees: { nom: string; photo?: string | null },
): Resultat {
  const compte = deps.comptes.parId(compteId);
  if (!compte) return echec("introuvable");
  const erreur = erreursNom(donnees.nom);
  if (erreur) return echecChamps({ nom: erreur });
  deps.comptes.modifier({
    ...compte,
    nom: donnees.nom.trim(),
    photo: donnees.photo === undefined ? compte.photo : donnees.photo,
  });
  return succes();
}

/**
 * US-06 : recherche par nom (3 caractères min) ou par e-mail exact.
 * Le résultat ne contient jamais l'e-mail.
 */
export function rechercherProfils(
  deps: DepsIdentite,
  requete: string,
): ProfilPersonnel[] {
  const q = requete.trim();
  if (q.includes("@")) {
    const compte = deps.comptes.parEmail(normaliserEmail(q));
    return compte ? [profilPublic(compte)] : [];
  }
  if (q.length < 3) return [];
  const bas = q.toLowerCase();
  return deps.comptes
    .tous()
    .filter((c) => c.nom.toLowerCase().includes(bas))
    .slice(0, 10)
    .map(profilPublic);
}
