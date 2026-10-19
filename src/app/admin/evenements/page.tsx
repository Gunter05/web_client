import { ListeVide, Pagination, Recherche } from "@/modules/administration";
import { listerEvenements } from "@/modules/administration/server";
import { Badge } from "@/shared/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { DateCourte } from "../_coque/date-courte";
import { adminCourant } from "../_coque/garde";
import { lireRecherche } from "../_coque/sources";
import { Suspense } from "react";
import { SqueletteAdmin } from "@/app/admin/_coque/squelette";

async function Evenements({ searchParams }: PageProps<"/admin/evenements">) {
  const t = await getTranslations();
  const { q, page } = lireRecherche(await searchParams);
  if (!(await adminCourant())) return null;
  const resultats = await listerEvenements(q, page);
  return (
    <section className="grid gap-4">
      <h1 className="text-xl font-semibold">{t("admin.onglets.evenements")}</h1>
      <Recherche valeur={q} placeholder={t("admin.evenements.recherche")} />
      {resultats.total === 0 ? (
        <ListeVide
          message={q ? t("admin.aucunResultat") : t("admin.evenements.vide")}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("evenements.nom")}</TableHead>
                <TableHead className="hidden sm:table-cell">
                  {t("evenements.pageOrganisatrice")}
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  {t("evenements.colonneDebut")}
                </TableHead>
                <TableHead>{t("evenements.colonneStatut")}</TableHead>
                <TableHead className="hidden lg:table-cell">
                  {t("admin.evenements.creeLe")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resultats.elements.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="max-w-56 font-medium whitespace-normal">
                    <Link href={`/e/${e.id}`} className="hover:underline">
                      {e.nom}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {e.page}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <DateCourte iso={e.debut} />
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        e.statut === "annule"
                          ? "destructive"
                          : e.statut === "modifie"
                            ? "outline"
                            : "secondary"
                      }
                    >
                      {t(`statuts.${e.statut as "publie"}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <DateCourte iso={e.creeLe} />
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
 * Les paramètres d'URL et la session sont lus dans Evenements, derrière ce
 * Suspense : le cadre de la page reste instantané (Cache Components).
 */
export default function Page(props: PageProps<"/admin/evenements">) {
  return (
    <Suspense fallback={<SqueletteAdmin />}>
      <Evenements {...props} />
    </Suspense>
  );
}
