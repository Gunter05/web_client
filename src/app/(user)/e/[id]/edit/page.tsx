import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { isEditable, EventForm } from "@/modules/events";
import { getEventById } from "@/modules/events/server";
import { updateEventAction } from "@/modules/events/application/events.actions";
import { getCurrentUser, getMyPageById } from "@/modules/pages/server";
import { PageTitle } from "@/shared/components/layout/PageTitle";
import { Suspense } from "react";
import { ContentSkeleton } from "@/shared/components/layout/ContentSkeleton";

/** Modifier un événement (US-15) : réservé aux membres de la page organisatrice. */
async function EditEvent({ params }: PageProps<"/e/[id]/edit">) {
  const { id } = await params;
  const t = await getTranslations("events");
  const event = await getEventById(id);
  if (!event) notFound();
  if (!(await getCurrentUser())) redirect(`/login?returnTo=/e/${id}/edit`);
  const isOrganizer = await getMyPageById(event.organizerPageId);

  return (
    <div className="mx-auto max-w-xl px-4 pt-6 pb-10 md:pt-10">
      <PageTitle title={t("edit")} returnTo={`/e/${id}`} />
      {!isOrganizer ? (
        <p className="rounded-xl border bg-muted/40 p-4 text-sm">
          {t("editRestricted")}
        </p>
      ) : !isEditable(event, new Date()) ? (
        <p className="rounded-xl border bg-muted/40 p-4 text-sm">
          {t("notEditable")}
        </p>
      ) : (
        <EventForm
          page={isOrganizer}
          event={event}
          action={updateEventAction}
        />
      )}
    </div>
  );
}

/**
 * Les paramètres d'URL et la session sont lus dans ModifierEvenement, derrière ce
 * Suspense : le cadre de la page reste instantané (Cache Components).
 */
export default function Page(props: PageProps<"/e/[id]/edit">) {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <EditEvent {...props} />
    </Suspense>
  );
}
