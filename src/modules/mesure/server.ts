import "server-only";
import type { Mesure } from "./domain/mesure";
import { envoyer } from "./infrastructure/analytics-simule";

/**
 * Trace une action suivie par les métriques du cadrage : consultation de
 * fiche, arrivée par lien partagé, clic sur « Partager », publication.
 */
export function mesurer(mesure: Omit<Mesure, "le">): void {
  envoyer({ ...mesure, le: new Date().toISOString() });
}
