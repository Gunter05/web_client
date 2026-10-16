import { type Horloge, jourUtc } from "@/shared/lib/horloge";
import { dejaVue, estUnRobot, type Vue } from "../domain/vue";

export type DepotVues = { toutes(): Vue[]; ajouter(vue: Vue): void };

export type DepsAudience = { vues: DepotVues; horloge: Horloge };

export type Ouverture = {
  evenementId: string;
  visiteurId: string;
  userAgent: string | null;
  /** Le lecteur est membre de la page organisatrice (fourni par l'appelant). */
  estMembreOrganisateur: boolean;
};

/** Renvoie true si l'ouverture compte comme une nouvelle vue (US-39). */
export function enregistrerOuverture(
  deps: DepsAudience,
  o: Ouverture,
): boolean {
  if (estUnRobot(o.userAgent) || o.estMembreOrganisateur) return false;
  const vue: Vue = {
    evenementId: o.evenementId,
    visiteurId: o.visiteurId,
    jour: jourUtc(deps.horloge.maintenant()),
  };
  if (dejaVue(deps.vues.toutes(), vue)) return false;
  deps.vues.ajouter(vue);
  return true;
}

export function compterVues(
  deps: DepsAudience,
  evenementIds: readonly string[],
): Map<string, number> {
  const compte = new Map<string, number>(evenementIds.map((id) => [id, 0]));
  for (const vue of deps.vues.toutes()) {
    const n = compte.get(vue.evenementId);
    if (n !== undefined) compte.set(vue.evenementId, n + 1);
  }
  return compte;
}
