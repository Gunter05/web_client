import { PlusSquareIcon } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { EventViewsTable } from "@/modules/audience";
import { countViews } from "@/modules/audience/server";
import { getPageEvents } from "@/modules/events/server";
import { MyPageTabs } from "@/modules/pages";
import { buttonVariants } from "@/shared/ui/button";
import { getCurrentUser, getMyPage } from "@/modules/pages/server";
import { PageTitle } from "@/shared/components/layout/PageTitle";
import { ContentSkeleton } from "@/shared/components/layout/ContentSkeleton";

/** Événements d'une de mes pages, avec le nombre de vues (US-39). */
async function MyPageEvents({ params }: PageProps<"/my-pages/[slug]">) {
  const { slug } = await params;
  if (!(await getCurrentUser())) redirect(`/login?returnTo=/my-pages/${slug}`);
  const page = await getMyPage(slug);
  if (!page) notFound();
  const t = await getTranslations("pages.myPages");
  const events = await getPageEvents(page.slug);
  return (
    <div className="mx-auto grid max-w-3xl gap-4 px-4 pt-6 md:pt-10">
      <PageTitle
        title={page.name}
        subtitle={`@${page.slug}`}
        returnTo="/my-pages"
      />
      <MyPageTabs slug={page.slug} role={page.role} active="events" />
      <Link
        href={`/events/new?page=${encodeURIComponent(page.slug)}`}
        className={buttonVariants({ className: "justify-self-start" })}
      >
        <PlusSquareIcon /> {t("publish")}
      </Link>
      <EventViewsTable
        events={events}
        views={await countViews(
          page.id,
          events.map((e) => e.id),
        )}
      />
    </div>
  );
}

/** Les paramètres et la session sont lus derrière ce Suspense (Cache Components). */
export default function Page(props: PageProps<"/my-pages/[slug]">) {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <MyPageEvents {...props} />
    </Suspense>
  );
}
