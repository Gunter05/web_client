import { FlagOffIcon, Grid3x3Icon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { GrilleEvenements } from "@/modules/evenements";
import { evenementsDeLaPage } from "@/modules/evenements/server";
import { EntetePage } from "@/modules/pages";
import { pageParSlug } from "@/modules/pages/server";
import { buttonVariants } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { Suspense } from "react";
import { SqueletteContenu } from "@/app/(public)/_coque/squelette";

export async function generateMetadata({
  params,
}: PageProps<"/p/[slug]">): Promise<Metadata> {
  const detail = await pageParSlug((await params).slug);
  return detail
    ? { title: detail.page.nom, description: detail.page.description }
    : {};
}

/** Page publique d'une page organisatrice, façon profil Instagram. */
async function PagePublique({ params }: PageProps<"/p/[slug]">) {
  const t = await getTranslations();
  const detail = await pageParSlug((await params).slug);
  if (!detail) {
    return (
      <div className="flex flex-col items-center gap-4 px-4 py-24 text-center">
        <FlagOffIcon className="size-12 text-muted-foreground" />
        <h1 className="text-xl font-semibold">
          {t("pages.publique.introuvable")}
        </h1>
        <Link href="/" className={buttonVariants({ size: "lg" })}>
          {t("evenements.retourListe")}
        </Link>
      </div>
    );
  }
  const { page, nbMembres } = detail;
  const evenements = await evenementsDeLaPage(page.slug);
  return (
    <div className="mx-auto max-w-4xl sm:px-6 md:pt-6">
      <EntetePage
        page={page}
        nbEvenements={evenements.length}
        nbMembres={nbMembres}
      />
      <Separator />
      <h2 className="flex items-center justify-center gap-2 py-3 text-xs font-semibold tracking-widest uppercase">
        <Grid3x3Icon className="size-3.5" /> {t("evenements.listeTitre")}
      </h2>
      {evenements.length ? (
        <GrilleEvenements evenements={evenements} />
      ) : (
        <p className="py-16 text-center text-sm text-muted-foreground">
          {t("pages.publique.aucunEvenement")}
        </p>
      )}
    </div>
  );
}

/**
 * Les paramètres d'URL et la session sont lus dans PagePublique, derrière ce
 * Suspense : le cadre de la page reste instantané (Cache Components).
 */
export default function Page(props: PageProps<"/p/[slug]">) {
  return (
    <Suspense fallback={<SqueletteContenu />}>
      <PagePublique {...props} />
    </Suspense>
  );
}
