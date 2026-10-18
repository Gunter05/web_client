"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { compteCourant, rechercherProfils } from "@/modules/identite/server";
import type { ResultatRecherche } from "@/modules/pages";
import {
  deposerDemande,
  donnerAcces,
  membresDe,
  retirerAcces,
  retirerDemande,
} from "@/modules/pages/server";
import { televerserImage } from "@/shared/api/client";
import {
  champFichier,
  champId,
  champTexte,
  type EtatFormulaire,
  lireFormulaire,
} from "@/shared/lib/formulaire";
import { verifierImage } from "@/shared/lib/images";
import { codeErreurApi, sansErreurApi } from "./_erreurs";

/** Demander la création d'une page (US-03) ; l'API prévient les admins. */
export async function actionDemanderPage(
  _: EtatFormulaire,
  donnees: FormData,
): Promise<EtatFormulaire> {
  if (!(await compteCourant())) return { erreur: "connexionRequise" };
  const f = lireFormulaire(
    {
      nom: champTexte(200),
      description: champTexte(2000),
      type: champTexte(50),
      justification: champTexte(2000),
      photo: champFichier,
    },
    donnees,
  );
  if (!f) return { erreur: "formulaireInvalide" };
  const erreurImage = f.photo ? verifierImage(f.photo) : null;
  if (erreurImage) {
    return { erreur: "formulaireInvalide", champs: { photo: erreurImage } };
  }
  const { photo, ...formulaire } = f;
  const resultat = await sansErreurApi(async () =>
    deposerDemande({
      ...formulaire,
      photo: photo ? await televerserImage(photo) : null,
    }),
  );
  if (!resultat.ok) return resultat.etat;
  redirect("/demande-page?msg=envoyee");
}

export async function actionRetirerDemande(demandeId: string): Promise<void> {
  const id = champId.safeParse(demandeId);
  if (id.success) await codeErreurApi(() => retirerDemande(id.data));
  revalidatePath("/demande-page");
}

/**
 * US-06 : nom (3 caractères min) ou e-mail exact ; jamais d'e-mail en retour.
 * Les membres déjà présents sont signalés pour masquer « Donner l'accès ».
 */
export async function actionRechercherUtilisateurs(
  pageId: string,
  requete: string,
): Promise<ResultatRecherche> {
  const entree = z
    .object({ pageId: champId, requete: z.string().max(200) })
    .safeParse({ pageId, requete });
  if (!entree.success) return [];
  const resultat = await sansErreurApi(async () => {
    const [profils, membres] = await Promise.all([
      rechercherProfils(entree.data.requete),
      membresDe(entree.data.pageId),
    ]);
    const ids = new Set(membres.map((m) => m.compteId));
    return profils.map((p) => ({ ...p, membre: ids.has(p.id) }));
  });
  return resultat.ok ? resultat.valeur : [];
}

const entreeAcces = z.object({ pageId: champId, compteId: champId });

export async function actionDonnerAcces(
  pageId: string,
  compteId: string,
): Promise<{ erreur?: string; nom?: string }> {
  const entree = entreeAcces.safeParse({ pageId, compteId });
  if (!entree.success) return { erreur: "formulaireInvalide" };
  const erreur = await codeErreurApi(() =>
    donnerAcces(entree.data.pageId, entree.data.compteId),
  );
  revalidatePath("/acces");
  if (erreur) return { erreur };
  const membres = await membresDe(entree.data.pageId);
  return {
    nom: membres.find((m) => m.compteId === entree.data.compteId)?.nom ?? "",
  };
}

export async function actionRetirerAcces(
  pageId: string,
  compteId: string,
): Promise<{ erreur?: string }> {
  const entree = entreeAcces.safeParse({ pageId, compteId });
  if (!entree.success) return { erreur: "formulaireInvalide" };
  const erreur = await codeErreurApi(() =>
    retirerAcces(entree.data.pageId, entree.data.compteId),
  );
  revalidatePath("/acces");
  return erreur ? { erreur } : {};
}
