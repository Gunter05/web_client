"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { peutActiver } from "@/modules/profil-actif";
import {
  acteurCourant,
  ecrirePageActive,
  profilsDePages,
} from "../_services/acteur";

/** Rend actif le profil personnel (null) ou une page dont on est membre (US-37). */
export async function actionChoisirProfil(
  pageId: string | null,
): Promise<{ erreur?: string }> {
  const id = z.string().max(100).nullable().safeParse(pageId);
  if (!id.success) return { erreur: "formulaireInvalide" };
  if (!(await acteurCourant())) return { erreur: "connexionRequise" };
  if (!peutActiver(id.data, await profilsDePages())) {
    return { erreur: "accesRefuse" };
  }
  await ecrirePageActive(id.data);
  revalidatePath("/", "layout");
  return {};
}

/** Oublie la page active dont l'accès a été retiré (US-37). */
export async function actionOublierPageActive(): Promise<void> {
  await ecrirePageActive(null);
}
