import { PlusSquareIcon } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { MesEvenements } from "@/features/audience";
import { compterVues } from "@/features/audience/server";
import { evenementsDeLaPage } from "@/features/events/server";
import { OngletsMaPage } from "@/features/pages";
import { buttonVariants } from "@/shared/components/ui/button";
import { acteurCourant, maPage } from "@/features/pages/server";
import { EnTetePage } from "@/shared/components/layout/EnTetePage";
import { SqueletteContenu } from "@/shared/components/layout/SqueletteContenu";

/** Événements d'une de mes pages, avec le nombre de vues (US-39). */
async function EvenementsDeMaPage({ params }: PageProps<"/my-pages/[slug]">) {
  const { slug } = await params;
  if (!(await acteurCourant())) redirect(`/login?retour=/my-pages/${slug}`);
  const page = await maPage(slug);
  if (!page) notFound();
  const t = await getTranslations("pages.mesPages");
  const evenements = await evenementsDeLaPage(page.slug);
  return (
    <div className="mx-auto grid max-w-3xl gap-4 px-4 pt-6 md:pt-10">
      <EnTetePage
        titre={page.nom}
        sousTitre={`@${page.slug}`}
        retour="/my-pages"
      />
      <OngletsMaPage slug={page.slug} role={page.role} actif="evenements" />
      <Link
        href={`/events/new?page=${encodeURIComponent(page.slug)}`}
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
export default function Page(props: PageProps<"/my-pages/[slug]">) {
  return (
    <Suspense fallback={<SqueletteContenu />}>
      <EvenementsDeMaPage {...props} />
    </Suspense>
  );
}
