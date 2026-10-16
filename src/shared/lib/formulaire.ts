import { z } from "zod";
import type { Echec } from "./resultat";

/** État renvoyé par les Server Actions de formulaire à l'interface. */
export type EtatFormulaire = {
  erreur?: string;
  champs?: Record<string, string>;
};

export function etatDepuisEchec(echec: Echec): EtatFormulaire {
  return echec.champs
    ? { champs: echec.champs, erreur: echec.code }
    : { erreur: echec.code };
}

/**
 * Lecture typée d'un FormData : toute Server Action est un endpoint public
 * (ADR 0008), ses entrées passent donc par Zod avant d'atteindre le domaine.
 * Les règles métier (longueurs, dates…) restent dans les modules.
 */
export function lireFormulaire<T extends z.ZodRawShape>(
  forme: T,
  donnees: FormData,
): z.infer<z.ZodObject<T>> | null {
  const brut: Record<string, unknown> = {};
  for (const cle of Object.keys(forme)) {
    const valeurs = donnees.getAll(cle);
    brut[cle] = forme[cle] instanceof z.ZodArray ? valeurs : valeurs[0];
  }
  const resultat = z.object(forme).safeParse(brut);
  return resultat.success ? resultat.data : null;
}

/** Texte de formulaire : chaîne bornée, absente = chaîne vide. */
export const champTexte = (max = 5000) =>
  z.preprocess((v) => (typeof v === "string" ? v : ""), z.string().max(max));

/** Fichier facultatif : un input file vide envoie un File de taille 0. */
export const champFichier = z.preprocess(
  (v) => (v instanceof File && v.size > 0 ? v : null),
  z.instanceof(File).nullable(),
);

export const champId = z.string().min(1).max(100);

/** Server Action de formulaire, fournie au module par la route qui le compose. */
export type ActionFormulaire = (
  etat: EtatFormulaire,
  donnees: FormData,
) => Promise<EtatFormulaire>;
