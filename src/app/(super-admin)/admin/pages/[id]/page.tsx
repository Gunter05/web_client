import { getPageDetails } from "@/modules/admin/server";
import { ProfileAvatar } from "@/shared/components/ProfileAvatar";
import { Badge } from "@/shared/ui/badge";
import { buttonVariants } from "@/shared/ui/button";
import { ArrowLeftIcon, ArrowSquareOutIcon } from "@/shared/components/icons";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShortDate } from "@/spaces/super-admin";
import { getCurrentAdmin } from "@/modules/admin/server";
import { Suspense } from "react";
import { AdminSkeleton } from "@/spaces/super-admin";

/** Détail d'une page : propriétaire, membres nominatifs et événements (US-07). */
async function AdminPageDetailsView({
  params,
}: PageProps<"/admin/pages/[id]">) {
  const t = await getTranslations();
  if (!(await getCurrentAdmin())) return null;
  const detail = await getPageDetails((await params).id);
  if (!detail) notFound();
  const { page, members, events } = detail;
  return (
    <section className="grid gap-6">
      <Link
        href="/admin/pages"
        className={buttonVariants({
          variant: "ghost",
          size: "sm",
          className: "justify-self-start",
        })}
      >
        <ArrowLeftIcon /> {t("admin.tabs.pages")}
      </Link>
      <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-6">
        <ProfileAvatar name={page.name} photo={page.photoUrl} size="lg" />
        <div className="grid gap-1">
          <h1 className="text-xl font-semibold">{page.name}</h1>
          <Badge variant="secondary">{t(`pages.types.${page.type}`)}</Badge>
        </div>
        <Link
          href={`/p/${page.slug}`}
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "ml-auto",
          })}
        >
          <ArrowSquareOutIcon /> /p/{page.slug}
        </Link>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <div className="grid content-start gap-3 rounded-xl border bg-card p-4">
          <h2 className="font-semibold">
            {t("admin.pages.members")} ({members.length})
          </h2>
          <ul className="grid gap-3">
            {members.map((m) => (
              <li key={m.accountId} className="flex items-center gap-3 text-sm">
                <ProfileAvatar name={m.name} photo={m.photoUrl} size="sm" />
                <span className="flex-1">{m.name}</span>
                <Badge variant={m.role === "owner" ? "default" : "secondary"}>
                  {t(`pages.roles.${m.role}`)}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid content-start gap-3 rounded-xl border bg-card p-4">
          <h2 className="font-semibold">
            {t("admin.pages.events")} ({events.length})
          </h2>
          <ul className="grid divide-y text-sm">
            {events.map((e) => (
              <li key={e.id} className="flex items-center gap-3 py-2">
                <Link
                  href={`/e/${e.id}`}
                  className="flex-1 font-medium hover:underline"
                >
                  {e.name}
                </Link>
                <span className="text-muted-foreground">
                  <ShortDate iso={e.startsAt} />
                </span>
                <Badge variant="outline">{t(`statuses.${e.status}`)}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/**
 * Les paramètres d'URL et la session sont lus dans DetailPage, derrière ce
 * Suspense : le cadre de la page reste instantané (Cache Components).
 */
export default function Page(props: PageProps<"/admin/pages/[id]">) {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <AdminPageDetailsView {...props} />
    </Suspense>
  );
}
