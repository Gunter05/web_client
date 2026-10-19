import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { GestionAcces, OngletsMaPage } from "@/modules/pages";
import { membresDe } from "@/modules/pages/server";
import {
  actionDonnerAcces,
  actionRechercherUtilisateurs,
  actionRetirerAcces,
} from "../../../../_actions/pages";
import { acteurCourant, maPage } from "../../../../_services/acteur";
import { EnTetePage } from "../../../_coque/en-tete-page";
import { SqueletteContenu } from "../../../_coque/squelette";

/** Accès à une de mes pages, réservé à son propriétaire (US-06). */
async function AccesDeMaPage({ params }: PageProps<"/mes-pages/[slug]/acces">) {
  const { slug } = await params;
  if (!(await acteurCourant())) {
    redirect(`/connexion?retour=/mes-pages/${slug}/acces`);
  }
  const page = await maPage(slug);
  if (!page) notFound();
  const t = await getTranslations();
  return (
    <div className="mx-auto grid max-w-2xl gap-4 px-4 pt-6 md:pt-10">
      <EnTetePage
        titre={page.nom}
        sousTitre={t("pages.acces.intro")}
        retour="/mes-pages"
      />
      <OngletsMaPage slug={page.slug} role={page.role} actif="acces" />
      {page.role !== "proprietaire" ? (
        <p className="rounded-xl border bg-muted/40 p-4 text-sm">
          {t("erreurs.accesRefuse")}
        </p>
      ) : (
        <GestionAcces
          membres={await membresDe(page.id)}
          rechercher={actionRechercherUtilisateurs.bind(null, page.id)}
          donner={actionDonnerAcces.bind(null, page.id)}
          retirer={actionRetirerAcces.bind(null, page.id)}
        />
      )}
    </div>
  );
}

/** Les paramètres et la session sont lus derrière ce Suspense (Cache Components). */
export default function Page(props: PageProps<"/mes-pages/[slug]/acces">) {
  return (
    <Suspense fallback={<SqueletteContenu />}>
      <AccesDeMaPage {...props} />
    </Suspense>
  );
}
