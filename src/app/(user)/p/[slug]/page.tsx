import { FlagOffIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { EventTiles, NextEventCard, nextEvent } from "@/modules/events";
import { getPageEvents } from "@/modules/events/server";
import { PageProfileHeader } from "@/modules/pages";
import { getPageBySlug } from "@/modules/pages/server";
import { buttonVariants } from "@/shared/components/Button";
import { Suspense } from "react";
import { ContentSkeleton } from "@/shared/components/layout/ContentSkeleton";

export async function generateMetadata({
  params,
}: PageProps<"/p/[slug]">): Promise<Metadata> {
  const detail = await getPageBySlug((await params).slug);
  return detail
    ? { title: detail.page.name, description: detail.page.description }
    : {};
}

/**
 * Page publique d'une page organisatrice : couverture et carte de profil,
 * prochain événement en grande carte (s'il y en a un à venir), puis tous ses
 * événements en cartes compactes.
 */
async function PublicPage({ params }: PageProps<"/p/[slug]">) {
  const t = await getTranslations();
  const detail = await getPageBySlug((await params).slug);
  if (!detail) {
    return (
      <div className="flex flex-col items-center gap-4 px-4 py-24 text-center">
        <FlagOffIcon className="size-12 text-muted-foreground" />
        <h1 className="text-xl font-semibold">{t("pages.public.notFound")}</h1>
        <Link
          href="/"
          className={buttonVariants({ variant: "primary", size: "pill" })}
        >
          {t("events.backToList")}
        </Link>
      </div>
    );
  }
  const { page, memberCount } = detail;
  const events = await getPageEvents(page.slug);
  const next = nextEvent(events);
  return (
    <div className="mx-auto grid max-w-[960px] gap-7 md:px-4 md:pt-6">
      <PageProfileHeader
        page={page}
        eventCount={events.length}
        memberCount={memberCount}
      />
      {next && (
        <section className="grid gap-3 px-3 md:px-8">
          <h2 className="text-xl font-bold">{t("pages.public.nextEvent")}</h2>
          <NextEventCard event={next} />
        </section>
      )}
      <section className="grid gap-3 px-3 md:px-8">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          {t("events.listTitle")}
          <span className="grid h-6 min-w-6 place-items-center rounded-full bg-muted px-2 text-sm tabular-nums">
            {events.length}
          </span>
        </h2>
        {events.length ? (
          <EventTiles events={events} />
        ) : (
          <p className="py-16 text-center text-sm text-muted-foreground">
            {t("pages.public.noEvents")}
          </p>
        )}
      </section>
    </div>
  );
}

/**
 * Les paramètres d'URL et la session sont lus dans PagePublique, derrière ce
 * Suspense : le cadre de la page reste instantané (Cache Components).
 */
export default function Page(props: PageProps<"/p/[slug]">) {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <PublicPage {...props} />
    </Suspense>
  );
}
