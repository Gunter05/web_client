import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { FormulaireProfil } from "@/modules/identite";
import { compteCourant } from "@/modules/identite/server";
import { ToastDepuisUrl } from "@/shared/composants/toast-depuis-url";
import { actionProfil } from "../../_actions/identite";
import { EnTetePage } from "../_coque/en-tete-page";
import { Suspense } from "react";
import { SqueletteContenu } from "@/app/(public)/_coque/squelette";

/** Profil personnel : nom et photo. */
async function Profil() {
  const compte = await compteCourant();
  if (!compte) redirect("/connexion?retour=/profil");
  const t = await getTranslations("identite");
  return (
    <div className="mx-auto max-w-xl px-4 pt-6 md:pt-10">
      <ToastDepuisUrl messages={{ profilEnregistre: t("profilEnregistre") }} />
      <EnTetePage titre={t("monProfil")} sousTitre={compte.email} />
      <FormulaireProfil
        key={`${compte.nom}-${compte.photo}`}
        action={actionProfil}
        nom={compte.nom}
        photo={compte.photo}
      />
    </div>
  );
}

/** La session est lue dans Profil, derrière ce Suspense (Cache Components). */
export default function Page() {
  return (
    <Suspense fallback={<SqueletteContenu />}>
      <Profil />
    </Suspense>
  );
}
