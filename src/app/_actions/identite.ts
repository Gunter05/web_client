"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  compteCourant,
  connecter,
  deconnecter,
  inscrire,
  modifierProfil,
} from "@/modules/identite/server";
import {
  champFichier,
  champTexte,
  type EtatFormulaire,
  etatDepuisEchec,
  lireFormulaire,
} from "@/shared/lib/formulaire";
import { enregistrerImage, verifierImage } from "@/shared/stockage/fichiers";

/** N'accepte qu'un chemin interne, pour éviter les redirections ouvertes. */
function cheminInterne(retour: string): string {
  return retour.startsWith("/") && !retour.startsWith("//") ? retour : "/";
}

export async function actionConnexion(
  _: EtatFormulaire,
  donnees: FormData,
): Promise<EtatFormulaire> {
  const f = lireFormulaire(
    {
      email: champTexte(200),
      motDePasse: champTexte(200),
      retour: champTexte(500),
    },
    donnees,
  );
  if (!f) return { erreur: "formulaireInvalide" };
  const resultat = await connecter(f.email, f.motDePasse);
  if (!resultat.ok) return etatDepuisEchec(resultat);
  redirect(cheminInterne(f.retour));
}

export async function actionInscription(
  _: EtatFormulaire,
  donnees: FormData,
): Promise<EtatFormulaire> {
  const f = lireFormulaire(
    {
      nom: champTexte(200),
      email: champTexte(200),
      motDePasse: champTexte(200),
      retour: champTexte(500),
    },
    donnees,
  );
  if (!f) return { erreur: "formulaireInvalide" };
  const resultat = await inscrire(f);
  if (!resultat.ok) return etatDepuisEchec(resultat);
  redirect(cheminInterne(f.retour));
}

export async function actionDeconnexion(): Promise<void> {
  await deconnecter();
  redirect("/");
}

export async function actionProfil(
  _: EtatFormulaire,
  donnees: FormData,
): Promise<EtatFormulaire> {
  const compte = await compteCourant();
  if (!compte) return { erreur: "connexionRequise" };
  const f = lireFormulaire(
    { nom: champTexte(200), photo: champFichier },
    donnees,
  );
  if (!f) return { erreur: "formulaireInvalide" };
  if (f.photo) {
    const erreur = verifierImage(f.photo);
    if (erreur) return { champs: { photo: erreur } };
  }
  const resultat = modifierProfil(compte.id, {
    nom: f.nom,
    photo: f.photo ? await enregistrerImage(f.photo) : undefined,
  });
  if (!resultat.ok) return etatDepuisEchec(resultat);
  revalidatePath("/", "layout");
  redirect("/profil?msg=profilEnregistre");
}
