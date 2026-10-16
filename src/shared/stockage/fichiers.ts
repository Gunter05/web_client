import "server-only";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { dossierDonnees } from "./collection-json";

/** Stockage d'images simulé (remplace un futur stockage objet type S3). */
export const TYPES_IMAGE = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;
export const TAILLE_MAX_IMAGE = 5 * 1024 * 1024;

export type ErreurImage = "formatImage" | "tailleImage";

export function verifierImage(fichier: File): ErreurImage | null {
  if (!(fichier.type in TYPES_IMAGE)) return "formatImage";
  if (fichier.size > TAILLE_MAX_IMAGE) return "tailleImage";
  return null;
}

/** Enregistre l'image et renvoie son URL publique (`/media/<nom>`). */
export async function enregistrerImage(fichier: File): Promise<string> {
  const extension = TYPES_IMAGE[fichier.type as keyof typeof TYPES_IMAGE];
  const nom = `${crypto.randomUUID()}.${extension}`;
  const dossier = path.join(dossierDonnees(), "media");
  mkdirSync(dossier, { recursive: true });
  writeFileSync(
    path.join(dossier, nom),
    Buffer.from(await fichier.arrayBuffer()),
  );
  return `/media/${nom}`;
}

export function lireImage(
  nom: string,
): { contenu: Buffer; type: string } | null {
  if (!/^[\w-]+\.(jpg|png|webp)$/.test(nom)) return null;
  const chemin = path.join(dossierDonnees(), "media", nom);
  if (!existsSync(chemin)) return null;
  const extension = nom.split(".").pop();
  const type =
    Object.entries(TYPES_IMAGE).find(([, e]) => e === extension)?.[0] ??
    "application/octet-stream";
  return { contenu: readFileSync(chemin), type };
}
