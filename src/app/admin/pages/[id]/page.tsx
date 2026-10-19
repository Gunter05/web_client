import { detailPage } from "@/features/admin/server";
import { AvatarProfil } from "@/shared/components/AvatarProfil";
import { Badge } from "@/shared/components/ui/badge";
import { buttonVariants } from "@/shared/components/ui/button";
import { ArrowLeftIcon, ExternalLinkIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DateCourte } from "@/features/admin";
import { adminCourant } from "@/features/admin/server";
import { Suspense } from "react";
import { SqueletteAdmin } from "@/widgets/admin-shell/SqueletteAdmin";

/** Détail d'une page : propriétaire, membres nominatifs et événements (US-07). */
async function DetailPage({ params }: PageProps<"/admin/pages/[id]">) {
  const t = await getTranslations();
  if (!(await adminCourant())) return null;
  const detail = await detailPage((await params).id);
  if (!detail) notFound();
  const { page, membres, evenements } = detail;
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
        <ArrowLeftIcon /> {t("admin.onglets.pages")}
      </Link>
      <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-6">
        <AvatarProfil nom={page.nom} photo={page.photo} taille="lg" anneau />
        <div className="grid gap-1">
          <h1 className="text-xl font-semibold">{page.nom}</h1>
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
          <ExternalLinkIcon /> /p/{page.slug}
        </Link>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <div className="grid content-start gap-3 rounded-xl border bg-card p-4">
          <h2 className="font-semibold">
            {t("admin.pages.membres")} ({membres.length})
          </h2>
          <ul className="grid gap-3">
            {membres.map((m) => (
              <li key={m.compteId} className="flex items-center gap-3 text-sm">
                <AvatarProfil nom={m.nom} photo={m.photo} taille="sm" />
                <span className="flex-1">{m.nom}</span>
                <Badge
                  variant={m.role === "proprietaire" ? "default" : "secondary"}
                >
                  {t(`pages.roles.${m.role}`)}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid content-start gap-3 rounded-xl border bg-card p-4">
          <h2 className="font-semibold">
            {t("admin.pages.evenements")} ({evenements.length})
          </h2>
          <ul className="grid divide-y text-sm">
            {evenements.map((e) => (
              <li key={e.id} className="flex items-center gap-3 py-2">
                <Link
                  href={`/e/${e.id}`}
                  className="flex-1 font-medium hover:underline"
                >
                  {e.nom}
                </Link>
                <span className="text-muted-foreground">
                  <DateCourte iso={e.debut} />
                </span>
                <Badge variant="outline">{t(`statuts.${e.statut}`)}</Badge>
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
    <Suspense fallback={<SqueletteAdmin />}>
      <DetailPage {...props} />
    </Suspense>
  );
}
