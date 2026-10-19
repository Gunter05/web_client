import { ListeVide, Pagination, Recherche } from "@/modules/administration";
import { listerPages } from "@/modules/administration/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { DateCourte } from "../_coque/date-courte";
import { adminCourant } from "../_coque/garde";
import { lireRecherche } from "../_coque/sources";
import { Suspense } from "react";
import { SqueletteAdmin } from "@/app/admin/_coque/squelette";

async function Pages({ searchParams }: PageProps<"/admin/pages">) {
  const t = await getTranslations();
  const { q, page } = lireRecherche(await searchParams);
  if (!(await adminCourant())) return null;
  const resultats = await listerPages(q, page);
  return (
    <section className="grid gap-4">
      <h1 className="text-xl font-semibold">{t("admin.onglets.pages")}</h1>
      <Recherche valeur={q} placeholder={t("admin.pages.recherche")} />
      {resultats.total === 0 ? (
        <ListeVide
          message={q ? t("admin.aucunResultat") : t("admin.pages.vide")}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("pages.demande.nom")}</TableHead>
                <TableHead className="hidden sm:table-cell">
                  {t("admin.pages.proprietaire")}
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  {t("admin.pages.creeeLe")}
                </TableHead>
                <TableHead className="text-right">
                  {t("admin.pages.nbEvenements")}
                </TableHead>
                <TableHead className="text-right">
                  {t("admin.pages.nbMembres")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resultats.elements.map((p) => (
                <TableRow key={p.id} className="relative">
                  <TableCell>
                    <Link
                      href={`/admin/pages/${p.id}`}
                      className="flex items-center gap-2 font-medium after:absolute after:inset-0"
                    >
                      {p.nom}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {p.proprietaire}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <DateCourte iso={p.creeLe} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {p.nbEvenements}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {p.nbMembres}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <Pagination
        page={resultats.page}
        totalPages={resultats.totalPages}
        q={q}
      />
    </section>
  );
}

/**
 * Les paramètres d'URL et la session sont lus dans Pages, derrière ce
 * Suspense : le cadre de la page reste instantané (Cache Components).
 */
export default function Page(props: PageProps<"/admin/pages">) {
  return (
    <Suspense fallback={<SqueletteAdmin />}>
      <Pages {...props} />
    </Suspense>
  );
}
