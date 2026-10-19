import "server-only";
import { env } from "@/shared/config/env";
import { lireJeton } from "@/shared/api/jeton";

/**
 * Erreur renvoyée par l'API (ProblemDetail, ADR 0005 du backend). `code` est
 * la clé de traduction (`erreurs.*`), `champs` les erreurs par champ.
 */
export class ErreurApi extends Error {
  constructor(
    readonly statut: number,
    readonly code: string,
    readonly champs?: Record<string, string>,
  ) {
    super(code);
  }
}

type Options = {
  methode?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  corps?: unknown;
  formulaire?: FormData;
  /** Requête anonyme même si un jeton existe (ex. connexion). */
  anonyme?: boolean;
};

function codeParDefaut(statut: number): string {
  if (statut === 401) return "connexionRequise";
  if (statut === 403) return "accesRefuse";
  if (statut === 404) return "introuvable";
  if (statut === 400) return "formulaireInvalide";
  return "inconnue";
}

/**
 * Appel de l'API depuis le serveur Next.js (BFF, ADR 0003) : le navigateur ne
 * l'appelle jamais. Le jeton de session est joint automatiquement.
 */
export async function api<T>(
  chemin: string,
  options: Options = {},
): Promise<T> {
  const entetes: Record<string, string> = { Accept: "application/json" };
  const jeton = options.anonyme ? undefined : await lireJeton();
  if (jeton) entetes.Authorization = `Bearer ${jeton}`;
  let corps: BodyInit | undefined;
  if (options.formulaire) corps = options.formulaire;
  else if (options.corps !== undefined) {
    entetes["Content-Type"] = "application/json";
    corps = JSON.stringify(options.corps);
  }
  const reponse = await fetch(`${env.API_URL}${chemin}`, {
    method: options.methode ?? (corps ? "POST" : "GET"),
    headers: entetes,
    body: corps,
    cache: "no-store",
  });
  if (reponse.status === 204) return undefined as T;
  const contenu = await reponse.text();
  const donnees: unknown = contenu ? JSON.parse(contenu) : undefined;
  if (!reponse.ok) {
    const probleme = (donnees ?? {}) as {
      code?: string;
      champs?: Record<string, string>;
      /** Nom des erreurs par champ dans les modules au contrat anglais. */
      fieldErrors?: Record<string, string>;
    };
    throw new ErreurApi(
      reponse.status,
      probleme.code ?? codeParDefaut(reponse.status),
      probleme.champs ?? probleme.fieldErrors,
    );
  }
  return donnees as T;
}

/** Variante qui renvoie `null` quand la ressource n'existe pas (404). */
export async function apiOuNull<T>(
  chemin: string,
  options: Options = {},
): Promise<T | null> {
  try {
    return await api<T>(chemin, options);
  } catch (erreur) {
    if (erreur instanceof ErreurApi && erreur.statut === 404) return null;
    throw erreur;
  }
}

/** Téléverse une image vers l'API (ADR 0010 du backend) et renvoie son adresse. */
export async function televerserImage(fichier: File): Promise<string> {
  const formulaire = new FormData();
  formulaire.append("fichier", fichier);
  const { url } = await api<{ url: string }>("/api/v1/medias", { formulaire });
  return url;
}

/**
 * Traduit une erreur d'un module de l'API au contrat anglais dans les codes
 * (`erreurs.*`) et noms de champs du front. Les autres erreurs passent telles
 * quelles.
 */
export function traduireErreurApi(
  erreur: unknown,
  codes: Record<string, string>,
  champs: Record<string, string>,
): unknown {
  if (!(erreur instanceof ErreurApi)) return erreur;
  const traduits = erreur.champs
    ? Object.fromEntries(
        Object.entries(erreur.champs).map(([champ, code]) => [
          champs[champ] ?? champ,
          codes[code] ?? code,
        ]),
      )
    : undefined;
  return new ErreurApi(
    erreur.statut,
    codes[erreur.code] ?? erreur.code,
    traduits,
  );
}
