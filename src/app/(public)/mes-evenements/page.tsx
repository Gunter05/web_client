import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { MesEvenements } from "@/modules/audience";
import { compterVues } from "@/modules/audience/server";
import { evenementsDeLaPage } from "@/modules/evenements/server";
import { pageActive, profilActif } from "../../_services/acteur";
import { afficherEvenements } from "../../_services/affichage";
import { EnTetePage } from "../_coque/en-tete-page";
import { Suspense } from "react";
import { SqueletteContenu } from "@/app/(public)/_coque/squelette";

/** « Mes événements » de la page active, avec le nombre de vues (US-39). */
async function PageMesEvenements() {
  const etat = await profilActif();
  if (!etat) redirect("/connexion?retour=/mes-evenements");
  const t = await getTranslations("evenements");
  const page = pageActive(etat);
  if (!page) {
    return (
      <div className="mx-auto max-w-3xl px-4 pt-6 md:pt-10">
        <EnTetePage titre={t("mesEvenements")} />
        <p className="rounded-xl border bg-muted/40 p-4 text-sm">
          {t("choisirPageAide")}
        </p>
      </div>
    );
  }
  const evenements = afficherEvenements(evenementsDeLaPage(page.id));
  return (
    <div className="mx-auto max-w-3xl px-4 pt-6 md:pt-10">
      <EnTetePage titre={t("mesEvenements")} sousTitre={page.nom} />
      <MesEvenements
        evenements={evenements}
        vues={compterVues(evenements.map((e) => e.id))}
      />
    </div>
  );
}

/** La session est lue dans PageMesEvenements, derrière ce Suspense (Cache Components). */
export default function Page() {
  return (
    <Suspense fallback={<SqueletteContenu />}>
      <PageMesEvenements />
    </Suspense>
  );
}
