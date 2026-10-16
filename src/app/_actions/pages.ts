"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  compteCourant,
  idsAdmins,
  profilsParIds,
  rechercherProfils,
} from "@/modules/identite/server";
import { notifier } from "@/modules/notifications/server";
import type { ResultatRecherche } from "@/modules/pages";
import {
  deposerDemande,
  donnerAcces,
  membresDe,
  retirerAcces,
  retirerDemande,
} from "@/modules/pages/server";
import {
  champFichier,
  champId,
  champTexte,
  type EtatFormulaire,
  etatDepuisEchec,
  lireFormulaire,
} from "@/shared/lib/formulaire";
import { enregistrerImage, verifierImage } from "@/shared/stockage/fichiers";

/** Demander la création d'une page (US-03) ; les admins sont notifiés. */
export async function actionDemanderPage(
  _: EtatFormulaire,
  donnees: FormData,
): Promise<EtatFormulaire> {
  const compte = await compteCourant();
  if (!compte) return { erreur: "connexionRequise" };
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
  const resultat = deposerDemande(
    compte.id,
    formulaire,
    photo ? await enregistrerImage(photo) : null,
  );
  if (!resultat.ok) return etatDepuisEchec(resultat);
  notifier(
    {
      type: "demandeDeposee",
      demandeId: resultat.valeur.id,
      nomPage: resultat.valeur.nom,
    },
    idsAdmins(),
  );
  redirect("/demande-page?msg=envoyee");
}

export async function actionRetirerDemande(demandeId: string): Promise<void> {
  const compte = await compteCourant();
  const id = champId.safeParse(demandeId);
  if (compte && id.success) retirerDemande(compte.id, id.data);
  revalidatePath("/demande-page");
}

/** US-06 : nom (3 caractères min) ou e-mail exact ; jamais d'e-mail en retour. */
export async function actionRechercherUtilisateurs(
  pageId: string,
  requete: string,
): Promise<ResultatRecherche> {
  const entree = z
    .object({ pageId: champId, requete: z.string().max(200) })
    .safeParse({ pageId, requete });
  const compte = await compteCourant();
  if (!entree.success || !compte) return [];
  const membres = membresDe(entree.data.pageId);
  const proprietaire = membres.some(
    (m) => m.compteId === compte.id && m.role === "proprietaire",
  );
  if (!proprietaire) return [];
  const ids = new Set(membres.map((m) => m.compteId));
  return rechercherProfils(entree.data.requete).map((p) => ({
    ...p,
    membre: ids.has(p.id),
  }));
}

const entreeAcces = z.object({ pageId: champId, compteId: champId });

export async function actionDonnerAcces(
  pageId: string,
  compteId: string,
): Promise<{ erreur?: string; nom?: string }> {
  const entree = entreeAcces.safeParse({ pageId, compteId });
  if (!entree.success) return { erreur: "formulaireInvalide" };
  const proprietaire = await compteCourant();
  if (!proprietaire) return { erreur: "connexionRequise" };
  const resultat = donnerAcces(
    proprietaire.id,
    entree.data.pageId,
    entree.data.compteId,
  );
  if (!resultat.ok) return { erreur: resultat.code };
  notifier({
    type: "accesDonne",
    nomPage: resultat.valeur.nom,
    compteId: entree.data.compteId,
  });
  revalidatePath("/acces");
  return {
    nom:
      profilsParIds([entree.data.compteId]).get(entree.data.compteId)?.nom ??
      "",
  };
}

export async function actionRetirerAcces(
  pageId: string,
  compteId: string,
): Promise<{ erreur?: string }> {
  const entree = entreeAcces.safeParse({ pageId, compteId });
  if (!entree.success) return { erreur: "formulaireInvalide" };
  const proprietaire = await compteCourant();
  if (!proprietaire) return { erreur: "connexionRequise" };
  const resultat = retirerAcces(
    proprietaire.id,
    entree.data.pageId,
    entree.data.compteId,
  );
  if (!resultat.ok) return { erreur: resultat.code };
  notifier({
    type: "accesRetire",
    nomPage: resultat.valeur.nom,
    compteId: entree.data.compteId,
  });
  revalidatePath("/acces");
  return {};
}
