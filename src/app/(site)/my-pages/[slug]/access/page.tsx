import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { GestionAcces, OngletsMaPage } from "@/features/pages";
import { membresDe } from "@/features/pages/server";
import {
  actionDonnerAcces,
  actionRechercherUtilisateurs,
  actionRetirerAcces,
} from "@/features/pages/actions/pages.actions";
import { acteurCourant, maPage } from "@/features/pages/server";
import { EnTetePage } from "@/shared/components/layout/EnTetePage";
import { SqueletteContenu } from "@/shared/components/layout/SqueletteContenu";

/** Accès à une de mes pages, réservé à son propriétaire (US-06). */
async function AccesDeMaPage({ params }: PageProps<"/my-pages/[slug]/access">) {
  const { slug } = await params;
  if (!(await acteurCourant())) {
    redirect(`/login?retour=/my-pages/${slug}/access`);
  }
  const page = await maPage(slug);
  if (!page) notFound();
  const t = await getTranslations();
  return (
    <div className="mx-auto grid max-w-2xl gap-4 px-4 pt-6 md:pt-10">
      <EnTetePage
        titre={page.nom}
        sousTitre={t("pages.acces.intro")}
        retour="/my-pages"
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
export default function Page(props: PageProps<"/my-pages/[slug]/access">) {
  return (
    <Suspense fallback={<SqueletteContenu />}>
      <AccesDeMaPage {...props} />
    </Suspense>
  );
}
