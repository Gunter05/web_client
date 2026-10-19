import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { FormulaireProfil } from "@/features/auth";
import { compteCourant } from "@/features/auth/server";
import { ToastDepuisUrl } from "@/shared/components/ToastDepuisUrl";
import { actionProfil } from "@/features/auth/actions/auth.actions";
import { EnTetePage } from "@/shared/components/layout/EnTetePage";
import { Suspense } from "react";
import { SqueletteContenu } from "@/shared/components/layout/SqueletteContenu";

/** Profil personnel : nom et photo. */
async function Profil() {
  const compte = await compteCourant();
  if (!compte) redirect("/login?retour=/profile");
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
