import { Grid3x3Icon } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { EventGrid } from "@/modules/events";
import { getPageEvents } from "@/modules/events/server";
import { buttonVariants } from "@/shared/ui/button";

/** Onglet « Publications » : la grille des événements de la page. */
async function MyPageEvents({ params }: PageProps<"/my-pages/[slug]">) {
  const { slug } = await params;
  const t = await getTranslations();
  const events = await getPageEvents(slug);
  if (events.length) {
    return (
      <EventGrid events={events} className="lg:grid-cols-3 xl:grid-cols-3" />
    );
  }
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <Grid3x3Icon className="size-10 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        {t("pages.public.noEvents")}
      </p>
      <Link
        href={`/events/new?page=${encodeURIComponent(slug)}`}
        className={buttonVariants({ size: "sm" })}
      >
        {t("pages.myPages.publish")}
      </Link>
    </div>
  );
}

/** Les paramètres sont lus derrière ce Suspense (Cache Components). */
export default function Page(props: PageProps<"/my-pages/[slug]">) {
  return (
    <Suspense>
      <MyPageEvents {...props} />
    </Suspense>
  );
}
