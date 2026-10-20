import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ChoosePageDialog, EventForm } from "@/modules/events";
import { MemberPageList } from "@/modules/pages";
import { buttonVariants } from "@/shared/ui/button";
import { createEventAction } from "@/modules/events/application/events.actions";
import { getCurrentUser } from "@/modules/pages/server";
import { PageTitle } from "@/shared/components/layout/PageTitle";
import { ContentSkeleton } from "@/shared/components/layout/ContentSkeleton";

/**
 * Créer un événement (US-11), en deux étapes : choisir la page au nom de
 * laquelle publier (dans une fenêtre), puis remplir le formulaire (`?page={slug}`). Ouvert à
 * tous : sans compte, on passe d'abord par la connexion ; sans page, on
 * propose d'en demander une.
 */
async function NewEvent({ searchParams }: PageProps<"/events/new">) {
  const { page: slug } = await searchParams;
  const chosen = typeof slug === "string" ? slug : null;
  const returnTo = `/events/new${chosen ? `?page=${encodeURIComponent(chosen)}` : ""}`;
  const user = await getCurrentUser();
  if (!user) redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  const t = await getTranslations();
  const page = chosen
    ? (user.pages.find((p) => p.slug === chosen) ?? null)
    : null;

  if (page) {
    return (
      <div className="mx-auto max-w-2xl px-4 pt-6 md:pt-10">
        <PageTitle title={t("events.create")} returnTo="/events/new" />
        <EventForm page={page} action={createEventAction.bind(null, page.id)} />
      </div>
    );
  }

  const hasPages = user.pages.length > 0;
  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 md:pt-10">
      <PageTitle title={t("events.create")} returnTo="/" />
      <ChoosePageDialog
        title={hasPages ? t("events.choosePage") : t("events.noPage")}
        description={
          hasPages ? t("events.choosePageHelp") : t("events.noPageHelp")
        }
        primaryAction={
          hasPages ? undefined : (
            <Link
              href="/page-request"
              className={buttonVariants({ size: "lg" })}
            >
              {t("nav.requestPage")}
            </Link>
          )
        }
      >
        {hasPages && (
          <div className="grid max-h-[40vh] gap-3 overflow-y-auto">
            {chosen && (
              <p className="rounded-xl border border-destructive/40 bg-destructive/5 p-3 text-sm">
                {t("events.notMember")}
              </p>
            )}
            <MemberPageList
              pages={user.pages}
              link={(p) => `/events/new?page=${encodeURIComponent(p.slug)}`}
            />
          </div>
        )}
      </ChoosePageDialog>
    </div>
  );
}

/** La session et l'adresse sont lues dans NouvelEvenement, derrière ce Suspense (Cache Components). */
export default function Page(props: PageProps<"/events/new">) {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <NewEvent {...props} />
    </Suspense>
  );
}
