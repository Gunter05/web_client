import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { FormulaireEvenement } from "@/modules/evenements";
import { buttonVariants } from "@/shared/ui/button";
import { actionCreerEvenement } from "../../../_actions/evenements";
import { pageActive, profilActif } from "../../../_services/acteur";
import { EnTetePage } from "../../_coque/en-tete-page";
import { Suspense } from "react";
import { SqueletteContenu } from "@/app/(public)/_coque/squelette";

/** Créer un événement (US-11), uniquement avec une page active (US-37). */
async function NouvelEvenement() {
  const t = await getTranslations();
  const etat = await profilActif();
  if (!etat) redirect("/connexion?retour=/evenements/nouveau");
  const page = pageActive(etat);
  const aDesPages = etat.profils.length > 1;

  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 md:pt-10">
      <EnTetePage titre={t("evenements.creer")} retour="/" />
      {page ? (
        <FormulaireEvenement page={page} action={actionCreerEvenement} />
      ) : (
        <div className="grid gap-3 rounded-xl border bg-muted/40 p-5">
          <p className="font-semibold">
            {t("evenements.choisirPagePourPublier")}
          </p>
          <p className="text-sm text-muted-foreground">
            {aDesPages
              ? t("evenements.choisirPageAide")
              : t("evenements.pasDePage")}
          </p>
          {!aDesPages && (
            <Link
              href="/demande-page"
              className={buttonVariants({ className: "justify-self-start" })}
            >
              {t("nav.demanderPage")}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

/** La session est lue dans NouvelEvenement, derrière ce Suspense (Cache Components). */
export default function Page() {
  return (
    <Suspense fallback={<SqueletteContenu />}>
      <NouvelEvenement />
    </Suspense>
  );
}
