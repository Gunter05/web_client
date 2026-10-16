"use server";

import {
  enregistrerOuverture,
  visiteurCourant,
} from "@/modules/audience/server";
import { evenementParId } from "@/modules/evenements/server";
import { mesurer } from "@/modules/mesure/server";
import { estMembre } from "@/modules/pages/server";
import { champId } from "@/shared/lib/formulaire";
import { acteurCourant } from "../_services/acteur";

/**
 * Ouverture d'une fiche : vue unique (US-39, membres de la page exclus) et
 * métriques « fiche consultée » et « arrivée par lien partagé ».
 */
export async function actionOuvertureFiche(
  evenementId: string,
  viaLienPartage: boolean,
): Promise<void> {
  const id = champId.safeParse(evenementId);
  if (!id.success) return;
  const evenement = evenementParId(id.data);
  if (!evenement) return;
  const acteur = await acteurCourant();
  const membre = acteur ? estMembre(evenement.pageId, acteur.compte.id) : false;
  const visiteurId = await enregistrerOuverture(evenement.id, membre);
  mesurer({ type: "fiche_ouverte", evenementId: evenement.id, visiteurId });
  if (viaLienPartage === true) {
    mesurer({
      type: "arrivee_lien_partage",
      evenementId: evenement.id,
      visiteurId,
    });
  }
}

export async function actionClicPartager(evenementId: string): Promise<void> {
  const id = champId.safeParse(evenementId);
  if (!id.success || !evenementParId(id.data)) return;
  mesurer({
    type: "clic_partager",
    evenementId: id.data,
    visiteurId: await visiteurCourant(),
  });
}
