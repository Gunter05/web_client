"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  CATEGORIES,
  type ChampsEvenement,
  type FiltresUrl,
  PERIODES,
  validerFormulaire,
} from "@/modules/evenements";
import {
  annulerEvenement,
  creerEvenement,
  type DonneesEnvoyees,
  evenementParId,
  modifierEvenement,
} from "@/modules/evenements/server";
import { televerserImage } from "@/shared/api/client";
import {
  champFichier,
  champId,
  champTexte,
  type EtatFormulaire,
  lireFormulaire,
} from "@/shared/lib/formulaire";
import { verifierImage } from "@/shared/lib/images";
import { acteurCourant, maPageParId } from "../_services/acteur";
import { listerDepuisUrl } from "../_services/affichage";
import { sansErreurApi } from "./_erreurs";

/**
 * Vérifie que la personne connectée est membre de la page au nom de laquelle
 * elle agit (US-06, US-37). La page est choisie à chaque action : celle qui
 * organise l'événement, ou celle choisie avant de créer. L'API revérifie.
 */
async function pageDuMembre(
  pageId: string,
): Promise<{ pageId: string } | { etat: EtatFormulaire }> {
  const acteur = await acteurCourant();
  if (!acteur) return { etat: { erreur: "connexionRequise" } };
  const page = await maPageParId(pageId);
  if (!page) return { etat: { erreur: "pasAutorisePublier" } };
  return { pageId: page.id };
}

const formeEvenement = {
  nom: champTexte(500),
  debut: champTexte(50),
  fin: champTexte(50),
  lieu: champTexte(500),
  categories: z.array(z.string().max(50)).max(CATEGORIES.length),
  description: champTexte(5000),
  photo: champFichier,
  retirerPhoto: champTexte(1),
};

/**
 * Vérifie le formulaire et la photo avant tout envoi (pas d'image orpheline
 * sur l'API pour un formulaire invalide), puis prépare le corps de la requête.
 */
async function preparer(
  formulaire: ChampsEvenement,
  photo: File | null,
  photoActuelle: string | null,
  retirer: boolean,
  debutActuel: string | null,
): Promise<
  { ok: true; corps: DonneesEnvoyees } | { ok: false; etat: EtatFormulaire }
> {
  const erreurImage = photo ? verifierImage(photo) : null;
  const valide = validerFormulaire(formulaire, new Date(), debutActuel);
  const champs = {
    ...(valide.ok ? {} : valide.champs),
    ...(erreurImage ? { photo: erreurImage } : {}),
  };
  if (Object.keys(champs).length) {
    return { ok: false, etat: { erreur: "formulaireInvalide", champs } };
  }
  const nouvellePhoto = photo
    ? await televerserImage(photo)
    : retirer
      ? null
      : photoActuelle;
  return {
    ok: true,
    corps: {
      nom: formulaire.nom,
      debut: formulaire.debut || null,
      fin: formulaire.fin || null,
      lieu: formulaire.lieu,
      categories: formulaire.categories,
      description: formulaire.description,
      photo: nouvellePhoto,
    },
  };
}

/** Créer un événement (US-11) au nom de la page choisie à l'étape précédente. */
export async function actionCreerEvenement(
  pageId: string,
  _: EtatFormulaire,
  donnees: FormData,
): Promise<EtatFormulaire> {
  const id = champId.safeParse(pageId);
  if (!id.success) return { erreur: "formulaireInvalide" };
  const page = await pageDuMembre(id.data);
  if ("etat" in page) return page.etat;
  const f = lireFormulaire(formeEvenement, donnees);
  if (!f) return { erreur: "formulaireInvalide" };
  const { photo, retirerPhoto, ...formulaire } = f;
  const prepare = await preparer(
    formulaire,
    photo,
    null,
    retirerPhoto === "1",
    null,
  );
  if (!prepare.ok) return prepare.etat;
  const resultat = await sansErreurApi(() =>
    creerEvenement(page.pageId, prepare.corps),
  );
  if (!resultat.ok) return resultat.etat;
  revalidatePath("/", "layout");
  redirect(`/e/${resultat.valeur.id}?msg=enLigne`);
}

export async function actionModifierEvenement(
  _: EtatFormulaire,
  donnees: FormData,
): Promise<EtatFormulaire> {
  const f = lireFormulaire({ ...formeEvenement, id: champId }, donnees);
  if (!f) return { erreur: "formulaireInvalide" };
  const { id, photo, retirerPhoto, ...formulaire } = f;
  const actuel = await evenementParId(id);
  if (!actuel) return { erreur: "evenementIntrouvable" };
  // On agit au nom de la page organisatrice de l'événement.
  const page = await pageDuMembre(actuel.pageId);
  if ("etat" in page) return page.etat;
  const prepare = await preparer(
    formulaire,
    photo,
    actuel.photo,
    retirerPhoto === "1",
    actuel.debut,
  );
  if (!prepare.ok) return prepare.etat;
  const resultat = await sansErreurApi(() =>
    modifierEvenement(page.pageId, id, prepare.corps),
  );
  if (!resultat.ok) return resultat.etat;
  revalidatePath("/", "layout");
  redirect(`/e/${id}?msg=modifie`);
}

export async function actionAnnulerEvenement(
  _: EtatFormulaire,
  donnees: FormData,
): Promise<EtatFormulaire> {
  const f = lireFormulaire({ id: champId, motif: champTexte(1000) }, donnees);
  if (!f) return { erreur: "formulaireInvalide" };
  const actuel = await evenementParId(f.id);
  if (!actuel) return { erreur: "evenementIntrouvable" };
  const page = await pageDuMembre(actuel.pageId);
  if ("etat" in page) return page.etat;
  const resultat = await sansErreurApi(() =>
    annulerEvenement(page.pageId, f.id, f.motif),
  );
  if (!resultat.ok) return resultat.etat;
  revalidatePath("/", "layout");
  redirect(`/e/${f.id}?msg=annule`);
}

const formeFiltres = z.object({
  categories: z.array(z.enum(CATEGORIES)).max(CATEGORIES.length),
  periodes: z.array(z.enum(PERIODES)).max(PERIODES.length),
  pages: z.array(z.string().max(100)).max(100),
});

/** Chargement progressif du fil, 20 par 20 (US-16). */
export async function actionChargerEvenements(
  filtres: FiltresUrl,
  depuis: number,
) {
  const f = formeFiltres.safeParse(filtres);
  const d = z.number().int().min(0).max(100_000).safeParse(depuis);
  if (!f.success || !d.success) return { evenements: [], suivant: null };
  const { evenements, suivant } = await listerDepuisUrl(f.data, d.data);
  return { evenements, suivant };
}
