import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { FormulaireEvenement } from "@/features/events";
import { ListePagesMembre } from "@/features/pages";
import { buttonVariants } from "@/shared/components/ui/button";
import { actionCreerEvenement } from "@/features/events/actions/events.actions";
import { acteurCourant } from "@/features/pages/server";
import { EnTetePage } from "@/shared/components/layout/EnTetePage";
import { SqueletteContenu } from "@/shared/components/layout/SqueletteContenu";

/**
 * Créer un événement (US-11), en deux étapes : choisir la page au nom de
 * laquelle publier, puis remplir le formulaire (`?page={slug}`). Ouvert à
 * tous : sans compte, on passe d'abord par la connexion ; sans page, on
 * propose d'en demander une.
 */
async function NouvelEvenement({ searchParams }: PageProps<"/events/new">) {
  const { page: slug } = await searchParams;
  const choisie = typeof slug === "string" ? slug : null;
  const retour = `/events/new${choisie ? `?page=${encodeURIComponent(choisie)}` : ""}`;
  const acteur = await acteurCourant();
  if (!acteur) redirect(`/login?retour=${encodeURIComponent(retour)}`);
  const t = await getTranslations();
  const page = choisie
    ? (acteur.pages.find((p) => p.slug === choisie) ?? null)
    : null;

  if (page) {
    return (
      <div className="mx-auto max-w-2xl px-4 pt-6 md:pt-10">
        <EnTetePage titre={t("evenements.creer")} retour="/events/new" />
        <FormulaireEvenement
          page={page}
          action={actionCreerEvenement.bind(null, page.id)}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-2xl gap-4 px-4 pt-6 md:pt-10">
      <EnTetePage
        titre={t("evenements.creer")}
        sousTitre={t("evenements.choisirPageAide")}
        retour="/"
      />
      {acteur.pages.length === 0 ? (
        <div className="grid gap-3 rounded-xl border bg-muted/40 p-5">
          <p className="font-semibold">{t("evenements.pasDePage")}</p>
          <p className="text-sm text-muted-foreground">
            {t("evenements.pasDePageAide")}
          </p>
          <Link
            href="/page-request"
            className={buttonVariants({ className: "justify-self-start" })}
          >
            {t("nav.demanderPage")}
          </Link>
        </div>
      ) : (
        <>
          {choisie && (
            <p className="rounded-xl border border-destructive/40 bg-destructive/5 p-3 text-sm">
              {t("evenements.pageNonMembre")}
            </p>
          )}
          <h2 className="font-semibold">
            {t("evenements.choisirPagePourPublier")}
          </h2>
          <ListePagesMembre
            pages={acteur.pages}
            lien={(p) => `/events/new?page=${encodeURIComponent(p.slug)}`}
          />
        </>
      )}
    </div>
  );
}

/** La session et l'adresse sont lues dans NouvelEvenement, derrière ce Suspense (Cache Components). */
export default function Page(props: PageProps<"/events/new">) {
  return (
    <Suspense fallback={<SqueletteContenu />}>
      <NouvelEvenement {...props} />
    </Suspense>
  );
}
