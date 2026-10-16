import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { estModifiable, FormulaireEvenement } from "@/modules/evenements";
import { evenementParId } from "@/modules/evenements/server";
import { actionModifierEvenement } from "../../../../_actions/evenements";
import { pageActive, profilActif } from "../../../../_services/acteur";
import { EnTetePage } from "../../../_coque/en-tete-page";
import { Suspense } from "react";
import { SqueletteContenu } from "@/app/(public)/_coque/squelette";

/** Modifier un événement (US-15) : réservé à la page organisatrice active. */
async function ModifierEvenement({ params }: PageProps<"/e/[id]/modifier">) {
  const { id } = await params;
  const t = await getTranslations("evenements");
  const evenement = evenementParId(id);
  if (!evenement) notFound();
  const etat = await profilActif();
  if (!etat) redirect(`/connexion?retour=/e/${id}/modifier`);
  const page = pageActive(etat);
  const organisatrice = page?.id === evenement.pageId ? page : null;

  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 md:pt-10">
      <EnTetePage titre={t("modifier")} retour={`/e/${id}`} />
      {!organisatrice ? (
        <p className="rounded-xl border bg-muted/40 p-4 text-sm">
          {t("choisirPagePourPublier")}
        </p>
      ) : !estModifiable(evenement, new Date()) ? (
        <p className="rounded-xl border bg-muted/40 p-4 text-sm">
          {t("nonModifiable")}
        </p>
      ) : (
        <FormulaireEvenement
          page={organisatrice}
          evenement={evenement}
          action={actionModifierEvenement}
        />
      )}
    </div>
  );
}

/**
 * Les paramètres d'URL et la session sont lus dans ModifierEvenement, derrière ce
 * Suspense : le cadre de la page reste instantané (Cache Components).
 */
export default function Page(props: PageProps<"/e/[id]/modifier">) {
  return (
    <Suspense fallback={<SqueletteContenu />}>
      <ModifierEvenement {...props} />
    </Suspense>
  );
}
