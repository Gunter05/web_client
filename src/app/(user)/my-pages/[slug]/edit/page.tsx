import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { PageEditForm } from "@/modules/pages";
import { updatePageAction } from "@/modules/pages/application/pages.actions";
import {
  getCurrentUser,
  getMyPage,
  getPageBySlug,
} from "@/modules/pages/server";
import { ContentSkeleton } from "@/shared/components/layout/ContentSkeleton";
import { PageTitle } from "@/shared/components/layout/PageTitle";

/** « Modifier la page », réservé à son propriétaire. */
async function EditMyPage({ params }: PageProps<"/my-pages/[slug]/edit">) {
  const { slug } = await params;
  if (!(await getCurrentUser())) {
    redirect(`/login?returnTo=/my-pages/${slug}/edit`);
  }
  const membership = await getMyPage(slug);
  const detail = await getPageBySlug(slug);
  if (!membership || !detail) notFound();
  const t = await getTranslations();
  return (
    <div className="mx-auto grid max-w-xl gap-2 px-4 pt-6 md:pt-10">
      <PageTitle title={t("pages.edit.title")} returnTo={`/my-pages/${slug}`} />
      {membership.role !== "owner" ? (
        <p className="rounded-xl border bg-muted/40 p-4 text-sm">
          {t("pages.edit.ownerOnly")}
        </p>
      ) : (
        <PageEditForm
          page={detail.page}
          action={updatePageAction.bind(null, detail.page.id)}
        />
      )}
    </div>
  );
}

/** Les paramètres et la session sont lus derrière ce Suspense (Cache Components). */
export default function Page(props: PageProps<"/my-pages/[slug]/edit">) {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <EditMyPage {...props} />
    </Suspense>
  );
}
