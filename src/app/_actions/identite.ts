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
import { televerserImage } from "@/shared/api/client";
import {
  champFichier,
  champTexte,
  type EtatFormulaire,
  lireFormulaire,
} from "@/shared/lib/formulaire";
import { verifierImage } from "@/shared/lib/images";
import { ecrirePageActive } from "../_services/acteur";
import { sansErreurApi } from "./_erreurs";

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
  const resultat = await sansErreurApi(() => connecter(f.email, f.motDePasse));
  if (!resultat.ok) return resultat.etat;
  // US-37 : après chaque connexion, le profil actif est le profil personnel.
  await ecrirePageActive(null);
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
  const resultat = await sansErreurApi(() =>
    inscrire({ nom: f.nom, email: f.email, motDePasse: f.motDePasse }),
  );
  if (!resultat.ok) return resultat.etat;
  await ecrirePageActive(null);
  redirect(cheminInterne(f.retour));
}

export async function actionDeconnexion(): Promise<void> {
  await deconnecter();
  await ecrirePageActive(null);
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
  const resultat = await sansErreurApi(async () =>
    modifierProfil(
      f.nom,
      f.photo ? await televerserImage(f.photo) : compte.photo,
    ),
  );
  if (!resultat.ok) return resultat.etat;
  revalidatePath("/", "layout");
  redirect("/profil?msg=profilEnregistre");
}
