import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { NewEventView } from "@/spaces/user";
import { PageTitle } from "@/shared/components/layout/PageTitle";
import { ContentSkeleton } from "@/shared/components/layout/ContentSkeleton";

/** Créer un événement, en page : sur téléphone, et quand l'adresse est ouverte directement. */
async function NewEvent({ searchParams }: PageProps<"/events/new">) {
  const { page } = await searchParams;
  const t = await getTranslations();
  return (
    <div className="mx-auto max-w-xl px-4 pt-6 pb-10 md:pt-10">
      <PageTitle title={t("events.create")} returnTo="/" />
      <NewEventView slug={typeof page === "string" ? page : null} />
    </div>
  );
}

/** La session et l'adresse sont lues dans NewEvent, derrière ce Suspense (Cache Components). */
export default function Page(props: PageProps<"/events/new">) {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <NewEvent {...props} />
    </Suspense>
  );
}
