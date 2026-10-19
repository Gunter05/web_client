import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { estModifiable, FormulaireEvenement } from "@/modules/evenements";
import { evenementParId } from "@/modules/evenements/server";
import { actionModifierEvenement } from "../../../../_actions/evenements";
import { acteurCourant, maPageParId } from "../../../../_services/acteur";
import { EnTetePage } from "../../../_coque/en-tete-page";
import { Suspense } from "react";
import { SqueletteContenu } from "@/app/(public)/_coque/squelette";

/** Modifier un événement (US-15) : réservé aux membres de la page organisatrice. */
async function ModifierEvenement({ params }: PageProps<"/e/[id]/modifier">) {
  const { id } = await params;
  const t = await getTranslations("evenements");
  const evenement = await evenementParId(id);
  if (!evenement) notFound();
  if (!(await acteurCourant())) redirect(`/connexion?retour=/e/${id}/modifier`);
  const organisatrice = await maPageParId(evenement.pageId);

  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 md:pt-10">
      <EnTetePage titre={t("modifier")} retour={`/e/${id}`} />
      {!organisatrice ? (
        <p className="rounded-xl border bg-muted/40 p-4 text-sm">
          {t("modificationReservee")}
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
