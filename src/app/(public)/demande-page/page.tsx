import { XCircleIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { compteCourant } from "@/modules/identite/server";
import { DemandeEnAttente, FormulaireDemande } from "@/modules/pages";
import { derniereDemandeDe } from "@/modules/pages/server";
import { ToastDepuisUrl } from "@/shared/composants/toast-depuis-url";
import { actionDemanderPage, actionRetirerDemande } from "../../_actions/pages";
import { EnTetePage } from "../_coque/en-tete-page";
import { Suspense } from "react";
import { SqueletteContenu } from "@/app/(public)/_coque/squelette";

/** Demander la création d'une page (US-03). */
async function DemandePage() {
  const compte = await compteCourant();
  if (!compte) redirect("/connexion?retour=/demande-page");
  const t = await getTranslations("pages.demande");
  const derniere = derniereDemandeDe(compte.id);

  return (
    <div className="mx-auto max-w-xl px-4 pt-6 md:pt-10">
      <ToastDepuisUrl messages={{ envoyee: t("envoyee") }} />
      <EnTetePage titre={t("titre")} sousTitre={t("intro")} />
      {derniere?.statut === "en_attente" ? (
        <DemandeEnAttente
          nom={derniere.nom}
          envoyeeLe={derniere.envoyeeLe}
          retirer={actionRetirerDemande.bind(null, derniere.id)}
        />
      ) : (
        <div className="grid gap-6">
          {derniere?.statut === "refusee" && (
            <div
              role="status"
              className="flex gap-3 rounded-xl border border-destructive/40 bg-danger-fond p-4 text-sm"
            >
              <XCircleIcon className="size-5 shrink-0 text-danger" />
              <div className="grid gap-1">
                <p>
                  {t("refusee", {
                    nom: derniere.nom,
                    motif: derniere.motifRefus ?? "",
                  })}
                </p>
                <p className="text-muted-foreground">{t("nouvelleDemande")}</p>
              </div>
            </div>
          )}
          <FormulaireDemande action={actionDemanderPage} />
        </div>
      )}
    </div>
  );
}

/** La session est lue dans DemandePage, derrière ce Suspense (Cache Components). */
export default function Page() {
  return (
    <Suspense fallback={<SqueletteContenu />}>
      <DemandePage />
    </Suspense>
  );
}
