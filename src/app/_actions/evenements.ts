"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  CATEGORIES,
  type FiltresUrl,
  type ChampsEvenement,
  PERIODES,
  validerFormulaire,
} from "@/modules/evenements";
import {
  annulerEvenement,
  type Auteur,
  creerEvenement,
  evenementParId,
  modifierEvenement,
} from "@/modules/evenements/server";
import { mesurer } from "@/modules/mesure/server";
import { estMembre } from "@/modules/pages/server";
import {
  champFichier,
  champId,
  champTexte,
  type EtatFormulaire,
  etatDepuisEchec,
  lireFormulaire,
} from "@/shared/lib/formulaire";
import { enregistrerImage, verifierImage } from "@/shared/stockage/fichiers";
import { acteurCourant, pageActive } from "../_services/acteur";
import { listerDepuisUrl } from "../_services/affichage";

/** On agit au nom de la page active (US-37) ; le module revérifie l'appartenance. */
async function auteurCourant(): Promise<Auteur | null> {
  const acteur = await acteurCourant();
  if (!acteur) return null;
  return {
    compteId: acteur.compte.id,
    pageId: pageActive(acteur.etat)?.id ?? null,
  };
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

/** Vérifie la photo, puis ne la stocke que si le reste du formulaire est valide. */
async function photoValidee(
  formulaire: ChampsEvenement,
  photo: File | null,
  retirer: boolean,
  debutActuel: string | null,
): Promise<
  | { ok: true; photo: string | null | undefined }
  | { ok: false; etat: EtatFormulaire }
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
  if (photo) return { ok: true, photo: await enregistrerImage(photo) };
  return { ok: true, photo: retirer ? null : undefined };
}

export async function actionCreerEvenement(
  _: EtatFormulaire,
  donnees: FormData,
): Promise<EtatFormulaire> {
  const auteur = await auteurCourant();
  if (!auteur) return { erreur: "connexionRequise" };
  if (!auteur.pageId) return { erreur: "choisirPage" };
  const f = lireFormulaire(formeEvenement, donnees);
  if (!f) return { erreur: "formulaireInvalide" };
  const { photo, retirerPhoto, ...formulaire } = f;
  const image = await photoValidee(
    formulaire,
    photo,
    retirerPhoto === "1",
    null,
  );
  if (!image.ok) return image.etat;
  const resultat = creerEvenement(
    auteur,
    estMembre,
    formulaire,
    image.photo ?? null,
  );
  if (!resultat.ok) return etatDepuisEchec(resultat);
  mesurer({ type: "evenement_publie", evenementId: resultat.valeur.id });
  revalidatePath("/", "layout");
  redirect(`/e/${resultat.valeur.id}?msg=enLigne`);
}

export async function actionModifierEvenement(
  _: EtatFormulaire,
  donnees: FormData,
): Promise<EtatFormulaire> {
  const auteur = await auteurCourant();
  if (!auteur) return { erreur: "connexionRequise" };
  const f = lireFormulaire({ ...formeEvenement, id: champId }, donnees);
  if (!f) return { erreur: "formulaireInvalide" };
  const { id, photo, retirerPhoto, ...formulaire } = f;
  const image = await photoValidee(
    formulaire,
    photo,
    retirerPhoto === "1",
    evenementParId(id)?.debut ?? null,
  );
  if (!image.ok) return image.etat;
  const resultat = modifierEvenement(
    auteur,
    estMembre,
    id,
    formulaire,
    image.photo,
  );
  if (!resultat.ok) return etatDepuisEchec(resultat);
  revalidatePath("/", "layout");
  redirect(`/e/${id}?msg=modifie`);
}

export async function actionAnnulerEvenement(
  _: EtatFormulaire,
  donnees: FormData,
): Promise<EtatFormulaire> {
  const auteur = await auteurCourant();
  if (!auteur) return { erreur: "connexionRequise" };
  const f = lireFormulaire({ id: champId, motif: champTexte(1000) }, donnees);
  if (!f) return { erreur: "formulaireInvalide" };
  const resultat = annulerEvenement(auteur, estMembre, f.id, f.motif);
  if (!resultat.ok) return etatDepuisEchec(resultat);
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
  return listerDepuisUrl(f.data, d.data);
}
