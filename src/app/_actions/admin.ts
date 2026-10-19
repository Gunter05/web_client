"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { accepterDemande, refuserDemande } from "@/modules/pages/server";
import {
  champId,
  champTexte,
  type EtatFormulaire,
  lireFormulaire,
} from "@/shared/lib/formulaire";
import { codeErreurApi, sansErreurApi } from "./_erreurs";

/** Le rôle admin est vérifié par l'API pour chaque décision (US-03). */
export async function actionAccepterDemande(
  demandeId: string,
): Promise<{ erreur?: string }> {
  const id = champId.safeParse(demandeId);
  if (!id.success) return { erreur: "formulaireInvalide" };
  const erreur = await codeErreurApi(() => accepterDemande(id.data));
  if (erreur) return { erreur };
  revalidatePath("/", "layout");
  redirect("/admin/demandes?msg=acceptee");
}

export async function actionRefuserDemande(
  _: EtatFormulaire,
  donnees: FormData,
): Promise<EtatFormulaire> {
  const f = lireFormulaire(
    { demandeId: champId, motif: champTexte(1000) },
    donnees,
  );
  if (!f) return { erreur: "formulaireInvalide" };
  const resultat = await sansErreurApi(() =>
    refuserDemande(f.demandeId, f.motif),
  );
  if (!resultat.ok) return resultat.etat;
  revalidatePath("/", "layout");
  redirect("/admin/demandes?msg=refusee");
}
