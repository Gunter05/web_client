"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { compteCourant } from "@/modules/identite/server";
import { notifier } from "@/modules/notifications/server";
import { accepterDemande, refuserDemande } from "@/modules/pages/server";
import {
  champId,
  champTexte,
  type EtatFormulaire,
  etatDepuisEchec,
  lireFormulaire,
} from "@/shared/lib/formulaire";

/** Le rôle admin est revérifié par le module pages pour chaque décision. */
async function acteur() {
  const compte = await compteCourant();
  return compte ? { compteId: compte.id, estAdmin: compte.estAdmin } : null;
}

export async function actionAccepterDemande(
  demandeId: string,
): Promise<{ erreur?: string }> {
  const id = champId.safeParse(demandeId);
  const admin = await acteur();
  if (!admin) return { erreur: "connexionRequise" };
  if (!id.success) return { erreur: "formulaireInvalide" };
  const resultat = accepterDemande(admin, id.data);
  if (!resultat.ok) return { erreur: resultat.code };
  notifier({
    type: "pageAcceptee",
    nomPage: resultat.valeur.page.nom,
    demandeurId: resultat.valeur.demande.demandeurId,
  });
  revalidatePath("/", "layout");
  redirect("/admin/demandes?msg=acceptee");
}

export async function actionRefuserDemande(
  _: EtatFormulaire,
  donnees: FormData,
): Promise<EtatFormulaire> {
  const admin = await acteur();
  if (!admin) return { erreur: "connexionRequise" };
  const f = lireFormulaire(
    { demandeId: champId, motif: champTexte(1000) },
    donnees,
  );
  if (!f) return { erreur: "formulaireInvalide" };
  const resultat = refuserDemande(admin, f.demandeId, f.motif);
  if (!resultat.ok) return etatDepuisEchec(resultat);
  notifier({
    type: "demandeRefusee",
    nomPage: resultat.valeur.nom,
    demandeurId: resultat.valeur.demandeurId,
    motif: resultat.valeur.motifRefus ?? "",
  });
  revalidatePath("/", "layout");
  redirect("/admin/demandes?msg=refusee");
}
