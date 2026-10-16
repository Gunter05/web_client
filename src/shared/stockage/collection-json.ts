import "server-only";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { env } from "@/shared/config/env";

/**
 * Persistance simulée (ADR 0011) : chaque module possède son propre fichier
 * `data/<collection>.json`, créé avec des données de démonstration au premier
 * accès. Écriture atomique (fichier temporaire puis renommage).
 * À remplacer par l'API (ADR 0003) en changeant les adapters des modules.
 */
export function dossierDonnees(): string {
  return env.CONTINENG_DATA_DIR ?? path.resolve(process.cwd(), "data");
}

export type Collection<T> = {
  tous(): T[];
  muter(changement: (elements: T[]) => T[] | void): void;
};

export function collection<T>(
  nom: string,
  initiales: () => T[],
): Collection<T> {
  const fichier = () => path.join(dossierDonnees(), `${nom}.json`);

  function ecrire(elements: T[]) {
    mkdirSync(dossierDonnees(), { recursive: true });
    const temporaire = `${fichier()}.${process.pid}.tmp`;
    writeFileSync(temporaire, JSON.stringify(elements, null, 2));
    renameSync(temporaire, fichier());
  }

  function tous(): T[] {
    if (!existsSync(fichier())) {
      const donnees = initiales();
      ecrire(donnees);
      return donnees;
    }
    return JSON.parse(readFileSync(fichier(), "utf8")) as T[];
  }

  return {
    tous,
    muter(changement) {
      const elements = tous();
      ecrire(changement(elements) ?? elements);
    },
  };
}
