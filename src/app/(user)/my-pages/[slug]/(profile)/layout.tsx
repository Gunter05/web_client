import { ExternalLinkIcon, PlusSquareIcon } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { countViews } from "@/modules/audience/server";
import { getPageEvents } from "@/modules/events/server";
import { MyPageTabs, PageProfileHeader } from "@/modules/pages";
import {
  getCurrentUser,
  getMyPage,
  getPageBySlug,
} from "@/modules/pages/server";
import { ContentSkeleton } from "@/shared/components/layout/ContentSkeleton";
import { UrlToast } from "@/shared/components/UrlToast";
import { buttonVariants } from "@/shared/ui/button";

/**
 * Une de mes pages, vue comme son propre profil Instagram : le même en-tête
 * (« Modifier la page » pour le propriétaire, total des vues) et les mêmes
 * onglets pour les publications et les accès.
 */
async function MyPageProfile({
  params,
  children,
}: LayoutProps<"/my-pages/[slug]">) {
  const { slug } = await params;
  if (!(await getCurrentUser())) redirect(`/login?returnTo=/my-pages/${slug}`);
  const membership = await getMyPage(slug);
  const detail = await getPageBySlug(slug);
  if (!membership || !detail) notFound();
  const t = await getTranslations();
  const events = await getPageEvents(slug);
  const views = await countViews(
    detail.page.id,
    events.map((e) => e.id),
  );
  const secondary = buttonVariants({ variant: "secondary", size: "sm" });
  return (
    <div className="mx-auto max-w-4xl sm:px-6 md:pt-6">
      <UrlToast messages={{ pageUpdated: t("pages.edit.saved") }} />
      <PageProfileHeader
        page={detail.page}
        eventCount={events.length}
        memberCount={detail.memberCount}
        viewCount={[...views.values()].reduce((sum, n) => sum + n, 0)}
        actions={
          <>
            {membership.role === "owner" && (
              <Link href={`/my-pages/${slug}/edit`} className={secondary}>
                {t("pages.edit.action")}
              </Link>
            )}
            <Link
              href={`/events/new?page=${encodeURIComponent(slug)}`}
              className={secondary}
            >
              <PlusSquareIcon /> {t("pages.myPages.publish")}
            </Link>
            <Link
              href={`/p/${slug}`}
              className={buttonVariants({
                variant: "secondary",
                size: "icon-sm",
                className: "!flex-none",
              })}
              aria-label={t("pages.myPages.viewPublic")}
              title={t("pages.myPages.viewPublic")}
            >
              <ExternalLinkIcon />
            </Link>
          </>
        }
      />
      <MyPageTabs slug={slug} role={membership.role} />
      {/* Contenu de l'onglet, détaché de la ligne des onglets */}
      <div className="pt-4 sm:pt-6">{children}</div>
    </div>
  );
}

/** Les paramètres et la session sont lus derrière ce Suspense (Cache Components). */
export default function Layout(props: LayoutProps<"/my-pages/[slug]">) {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <MyPageProfile {...props} />
    </Suspense>
  );
}
