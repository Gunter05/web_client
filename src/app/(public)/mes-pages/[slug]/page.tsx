import { PlusSquareIcon } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { MesEvenements } from "@/modules/audience";
import { compterVues } from "@/modules/audience/server";
import { evenementsDeLaPage } from "@/modules/evenements/server";
import { OngletsMaPage } from "@/modules/pages";
import { buttonVariants } from "@/shared/ui/button";
import { acteurCourant, maPage } from "../../../_services/acteur";
import { EnTetePage } from "../../_coque/en-tete-page";
import { SqueletteContenu } from "../../_coque/squelette";

/** Événements d'une de mes pages, avec le nombre de vues (US-39). */
async function EvenementsDeMaPage({ params }: PageProps<"/mes-pages/[slug]">) {
  const { slug } = await params;
  if (!(await acteurCourant()))
    redirect(`/connexion?retour=/mes-pages/${slug}`);
  const page = await maPage(slug);
  if (!page) notFound();
  const t = await getTranslations("pages.mesPages");
  const evenements = await evenementsDeLaPage(page.slug);
  return (
    <div className="mx-auto grid max-w-3xl gap-4 px-4 pt-6 md:pt-10">
      <EnTetePage
        titre={page.nom}
        sousTitre={`@${page.slug}`}
        retour="/mes-pages"
      />
      <OngletsMaPage slug={page.slug} role={page.role} actif="evenements" />
      <Link
        href={`/evenements/nouveau?page=${encodeURIComponent(page.slug)}`}
        className={buttonVariants({ className: "justify-self-start" })}
      >
        <PlusSquareIcon /> {t("publier")}
      </Link>
      <MesEvenements
        evenements={evenements}
        vues={await compterVues(
          page.id,
          evenements.map((e) => e.id),
        )}
      />
    </div>
  );
}

/** Les paramètres et la session sont lus derrière ce Suspense (Cache Components). */
export default function Page(props: PageProps<"/mes-pages/[slug]">) {
  return (
    <Suspense fallback={<SqueletteContenu />}>
      <EvenementsDeMaPage {...props} />
    </Suspense>
  );
}
