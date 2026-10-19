import "server-only";
import { apiMesures } from "./infrastructure/api-mesures";

/**
 * Clic sur « Partager » (métrique Viralité). Les autres mesures (fiche
 * consultée, arrivée par lien partagé, publication) sont prises par l'API.
 */
export const mesurerPartage = (evenementId: string, visiteurId: string) =>
  apiMesures.partage(evenementId, visiteurId);
