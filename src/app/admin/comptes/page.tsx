import { ListeVide, Pagination, Recherche } from "@/modules/administration";
import { listerComptes } from "@/modules/administration/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { getTranslations } from "next-intl/server";
import { DateCourte } from "../_coque/date-courte";
import { adminCourant } from "../_coque/garde";
import { lireRecherche } from "../_coque/sources";
import { Suspense } from "react";
import { SqueletteAdmin } from "@/app/admin/_coque/squelette";

async function Comptes({ searchParams }: PageProps<"/admin/comptes">) {
  const t = await getTranslations();
  const { q, page } = lireRecherche(await searchParams);
  if (!(await adminCourant())) return null;
  const resultats = await listerComptes(q, page);
  return (
    <section className="grid gap-4">
      <h1 className="text-xl font-semibold">{t("admin.onglets.comptes")}</h1>
      <Recherche valeur={q} placeholder={t("admin.comptes.recherche")} />
      {resultats.total === 0 ? (
        <ListeVide
          message={q ? t("admin.aucunResultat") : t("admin.comptes.vide")}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("identite.nom")}</TableHead>
                <TableHead>{t("identite.email")}</TableHead>
                <TableHead className="hidden sm:table-cell">
                  {t("admin.comptes.creeLe")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resultats.elements.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.nom}</TableCell>
                  <TableCell className="max-w-40 truncate">{c.email}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <DateCourte iso={c.creeLe} />
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
 * Les paramètres d'URL et la session sont lus dans Comptes, derrière ce
 * Suspense : le cadre de la page reste instantané (Cache Components).
 */
export default function Page(props: PageProps<"/admin/comptes">) {
  return (
    <Suspense fallback={<SqueletteAdmin />}>
      <Comptes {...props} />
    </Suspense>
  );
}
