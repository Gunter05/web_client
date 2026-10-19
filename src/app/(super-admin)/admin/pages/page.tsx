import { EmptyState, Pagination, AdminSearch } from "@/spaces/super-admin";
import { listPages } from "@/modules/admin/server";
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
import { ShortDate } from "@/spaces/super-admin";
import { getCurrentAdmin } from "@/modules/admin/server";
import { readSearchParams } from "@/modules/admin";
import { Suspense } from "react";
import { AdminSkeleton } from "@/spaces/super-admin";

async function Pages({ searchParams }: PageProps<"/admin/pages">) {
  const t = await getTranslations();
  const { q, page } = readSearchParams(await searchParams);
  if (!(await getCurrentAdmin())) return null;
  const results = await listPages(q, page);
  return (
    <section className="grid gap-4">
      <h1 className="text-xl font-semibold">{t("admin.tabs.pages")}</h1>
      <AdminSearch value={q} placeholder={t("admin.pages.search")} />
      {results.total === 0 ? (
        <EmptyState
          message={q ? t("admin.noResults") : t("admin.pages.empty")}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("pages.request.name")}</TableHead>
                <TableHead className="hidden sm:table-cell">
                  {t("admin.pages.owner")}
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  {t("admin.pages.createdOn")}
                </TableHead>
                <TableHead className="text-right">
                  {t("admin.pages.eventCount")}
                </TableHead>
                <TableHead className="text-right">
                  {t("admin.pages.memberCount")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.elements.map((p) => (
                <TableRow key={p.id} className="relative">
                  <TableCell>
                    <Link
                      href={`/admin/pages/${p.id}`}
                      className="flex items-center gap-2 font-medium after:absolute after:inset-0"
                    >
                      {p.name}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {p.owner}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <ShortDate iso={p.createdAt} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {p.eventCount}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {p.memberCount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <Pagination page={results.page} totalPages={results.totalPages} q={q} />
    </section>
  );
}

/**
 * Les paramètres d'URL et la session sont lus dans Pages, derrière ce
 * Suspense : le cadre de la page reste instantané (Cache Components).
 */
export default function Page(props: PageProps<"/admin/pages">) {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Pages {...props} />
    </Suspense>
  );
}
