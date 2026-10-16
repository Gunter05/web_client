import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { profilsParIds } from "@/modules/identite/server";
import { GestionAcces } from "@/modules/pages";
import { membresDe } from "@/modules/pages/server";
import {
  actionDonnerAcces,
  actionRechercherUtilisateurs,
  actionRetirerAcces,
} from "../../_actions/pages";
import { pageActive, profilActif } from "../../_services/acteur";
import { EnTetePage } from "../_coque/en-tete-page";
import { Suspense } from "react";
import { SqueletteContenu } from "@/app/(public)/_coque/squelette";

/** Rubrique « Accès », réservée au propriétaire de la page active (US-06). */
async function Acces() {
  const etat = await profilActif();
  if (!etat) redirect("/connexion?retour=/acces");
  const t = await getTranslations();
  const page = pageActive(etat);
  if (page?.role !== "proprietaire") {
    return (
      <div className="mx-auto max-w-2xl px-4 pt-6 md:pt-10">
        <EnTetePage titre={t("pages.acces.titre")} />
        <p className="rounded-xl border bg-muted/40 p-4 text-sm">
          {t("erreurs.accesRefuse")}
        </p>
      </div>
    );
  }
  const membres = membresDe(page.id);
  const profils = profilsParIds(membres.map((m) => m.compteId));
  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 md:pt-10">
      <EnTetePage
        titre={t("pages.acces.titre")}
        sousTitre={t("pages.acces.intro")}
      />
      <GestionAcces
        membres={membres.map((m) => ({
          compteId: m.compteId,
          role: m.role,
          ajouteLe: m.ajouteLe,
          nom: profils.get(m.compteId)?.nom ?? "—",
          photo: profils.get(m.compteId)?.photo ?? null,
        }))}
        rechercher={actionRechercherUtilisateurs.bind(null, page.id)}
        donner={actionDonnerAcces.bind(null, page.id)}
        retirer={actionRetirerAcces.bind(null, page.id)}
      />
    </div>
  );
}

/** La session est lue dans Acces, derrière ce Suspense (Cache Components). */
export default function Page() {
  return (
    <Suspense fallback={<SqueletteContenu />}>
      <Acces />
    </Suspense>
  );
}
