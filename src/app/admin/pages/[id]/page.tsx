import { evenementsDeLaPage } from "@/modules/evenements/server";
import { profilsParIds } from "@/modules/identite/server";
import { membresDe, pageParId } from "@/modules/pages/server";
import { AvatarProfil } from "@/shared/composants/avatar-profil";
import { Badge } from "@/shared/ui/badge";
import { buttonVariants } from "@/shared/ui/button";
import { ArrowLeftIcon, ExternalLinkIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DateCourte } from "../../_coque/date-courte";
import { adminCourant } from "../../_coque/garde";
import { Suspense } from "react";
import { SqueletteAdmin } from "@/app/admin/_coque/squelette";

/** Détail d'une page : propriétaire, membres nominatifs et événements (US-07). */
async function DetailPage({ params }: PageProps<"/admin/pages/[id]">) {
  const t = await getTranslations();
  if (!(await adminCourant())) return null;
  const page = pageParId((await params).id);
  if (!page) notFound();
  const membres = membresDe(page.id);
  const profils = profilsParIds(membres.map((m) => m.compteId));
  const evenements = evenementsDeLaPage(page.id);
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
                <AvatarProfil
                  nom={profils.get(m.compteId)?.nom ?? "?"}
                  photo={profils.get(m.compteId)?.photo ?? null}
                  taille="sm"
                />
                <span className="flex-1">{profils.get(m.compteId)?.nom}</span>
                <Badge
                  variant={m.role === "proprietaire" ? "default" : "secondary"}
                >
                  {t(`profilActif.${m.role}`)}
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
