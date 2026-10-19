import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { AccessManager, MyPageTabs } from "@/modules/pages";
import { getMembers } from "@/modules/pages/server";
import {
  grantAccessAction,
  searchUsersAction,
  revokeAccessAction,
} from "@/modules/pages/application/pages.actions";
import { getCurrentUser, getMyPage } from "@/modules/pages/server";
import { PageTitle } from "@/shared/components/layout/PageTitle";
import { ContentSkeleton } from "@/shared/components/layout/ContentSkeleton";

/** Accès à une de mes pages, réservé à son propriétaire (US-06). */
async function MyPageAccess({ params }: PageProps<"/my-pages/[slug]/access">) {
  const { slug } = await params;
  if (!(await getCurrentUser())) {
    redirect(`/login?returnTo=/my-pages/${slug}/access`);
  }
  const page = await getMyPage(slug);
  if (!page) notFound();
  const t = await getTranslations();
  return (
    <div className="mx-auto grid max-w-2xl gap-4 px-4 pt-6 md:pt-10">
      <PageTitle
        title={page.name}
        subtitle={t("pages.access.intro")}
        returnTo="/my-pages"
      />
      <MyPageTabs slug={page.slug} role={page.role} active="access" />
      {page.role !== "owner" ? (
        <p className="rounded-xl border bg-muted/40 p-4 text-sm">
          {t("errors.accessDenied")}
        </p>
      ) : (
        <AccessManager
          members={await getMembers(page.id)}
          search={searchUsersAction.bind(null, page.id)}
          grant={grantAccessAction.bind(null, page.id)}
          remove={revokeAccessAction.bind(null, page.id)}
        />
      )}
    </div>
  );
}

/** Les paramètres et la session sont lus derrière ce Suspense (Cache Components). */
export default function Page(props: PageProps<"/my-pages/[slug]/access">) {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <MyPageAccess {...props} />
    </Suspense>
  );
}
