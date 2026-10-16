"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { definirPageActive } from "@/modules/identite/server";
import { peutActiver } from "@/modules/profil-actif";
import { acteurCourant, profilsDePages } from "../_services/acteur";

/** Rend actif le profil personnel (null) ou une page dont on est membre (US-37). */
export async function actionChoisirProfil(
  pageId: string | null,
): Promise<{ erreur?: string }> {
  const id = z.string().max(100).nullable().safeParse(pageId);
  if (!id.success) return { erreur: "formulaireInvalide" };
  const acteur = await acteurCourant();
  if (!acteur) return { erreur: "connexionRequise" };
  if (!peutActiver(id.data, profilsDePages(acteur.compte.id))) {
    return { erreur: "accesRefuse" };
  }
  definirPageActive(acteur.session.token, id.data);
  revalidatePath("/", "layout");
  return {};
}
