import Link from "next/link";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { EventForm } from "@/modules/events";
import { createEventAction } from "@/modules/events/application/events.actions";
import { MemberPageList } from "@/modules/pages";
import { FormFrame } from "@/shared/components/FormFrame";
import { getCurrentUser } from "@/modules/pages/server";
import { buttonVariants } from "@/shared/ui/button";

/**
 * Créer un événement (US-11), en page sur téléphone et en modal sur
 * ordinateur. Avant tout, un écran dédié demande la page au nom de laquelle
 * publier (`?page={slug}` une fois choisie), sauf si l'on n'en a qu'une ; le
 * formulaire vient ensuite.
 * Sans compte, on passe d'abord par la connexion ; sans page, on propose
 * d'en demander une.
 */
export async function NewEventView({
  slug,
  inModal = false,
}: {
  slug: string | null;
  /** Dans le modal, chaque écran porte son titre (la page a le sien). */
  inModal?: boolean;
}) {
  const returnTo = `/events/new${slug ? `?page=${encodeURIComponent(slug)}` : ""}`;
  const user = await getCurrentUser();
  if (!user) redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  const t = await getTranslations();
  // Une seule page : pas d'écran de choix
  const page = slug
    ? user.pages.find((p) => p.slug === slug)
    : user.pages.length === 1
      ? user.pages[0]
      : undefined;

  if (page) {
    return (
      <EventForm
        title={inModal ? t("events.create") : undefined}
        page={page}
        changePageHref={user.pages.length > 1 ? "/events/new" : undefined}
        createAction={createEventAction}
      />
    );
  }

  if (user.pages.length === 0) {
    return (
      <Step
        title={t("events.noPage")}
        description={t("events.noPageHelp")}
        inModal={inModal}
      >
        <Link
          href="/page-request"
          className={buttonVariants({ size: "lg", className: "w-full" })}
        >
          {t("nav.requestPage")}
        </Link>
      </Step>
    );
  }

  return (
    <Step
      title={t("events.choosePage")}
      description={t("events.choosePageHelp")}
      inModal={inModal}
    >
      {slug && (
        <p className="rounded-xl border border-destructive/40 bg-destructive/5 p-3 text-sm">
          {t("events.notMember")}
        </p>
      )}
      <MemberPageList
        pages={user.pages}
        replace
        link={(p) => `/events/new?page=${encodeURIComponent(p.slug)}`}
      />
    </Step>
  );
}

/**
 * Écran d'une étape : dans le modal, l'en-tête fixe porte le titre général
 * du parcours ; la question de l'étape est centrée au-dessus de l'explication.
 */
function Step({
  title,
  description,
  inModal,
  children,
}: {
  title: string;
  description: string;
  inModal: boolean;
  children: ReactNode;
}) {
  const t = useTranslations("events");
  return (
    // En-tête général du parcours ; la question de l'étape vient dessous
    <FormFrame title={inModal ? t("create") : undefined}>
      <header className="grid justify-items-center gap-1.5 text-center">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      </header>
      {children}
    </FormFrame>
  );
}
