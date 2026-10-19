"use server";

import { signalerOuverture, visiteurCourant } from "@/features/audience/server";
import { mesurerPartage } from "@/features/metrics/server";
import { champId } from "@/shared/lib/formulaire";

/**
 * Ouverture d'une fiche : vue unique (US-39) et métriques « fiche consultée »
 * et « arrivée par lien partagé », prises par l'API.
 */
export async function actionOuvertureFiche(
  evenementId: string,
  viaLienPartage: boolean,
): Promise<void> {
  const id = champId.safeParse(evenementId);
  if (!id.success) return;
  await signalerOuverture(id.data, viaLienPartage === true).catch(() => {
    // Une mesure perdue ne doit jamais gêner la lecture de la fiche.
  });
}

export async function actionClicPartager(evenementId: string): Promise<void> {
  const id = champId.safeParse(evenementId);
  if (!id.success) return;
  await mesurerPartage(id.data, await visiteurCourant()).catch(() => {});
}
