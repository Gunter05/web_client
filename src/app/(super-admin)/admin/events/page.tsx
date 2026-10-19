import { EmptyState, Pagination, AdminSearch } from "@/spaces/super-admin";
import { listEvents } from "@/modules/admin/server";
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
import { ShortDate } from "@/spaces/super-admin";
import { getCurrentAdmin } from "@/modules/admin/server";
import { readSearchParams } from "@/modules/admin";
import { Suspense } from "react";
import { AdminSkeleton } from "@/spaces/super-admin";

async function AdminEventList({ searchParams }: PageProps<"/admin/events">) {
  const t = await getTranslations();
  const { q, page } = readSearchParams(await searchParams);
  if (!(await getCurrentAdmin())) return null;
  const results = await listEvents(q, page);
  return (
    <section className="grid gap-4">
      <h1 className="text-xl font-semibold">{t("admin.tabs.events")}</h1>
      <AdminSearch value={q} placeholder={t("admin.events.search")} />
      {results.total === 0 ? (
        <EmptyState
          message={q ? t("admin.noResults") : t("admin.events.empty")}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("events.name")}</TableHead>
                <TableHead className="hidden sm:table-cell">
                  {t("events.organizerPage")}
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  {t("events.columnStart")}
                </TableHead>
                <TableHead>{t("events.columnStatus")}</TableHead>
                <TableHead className="hidden lg:table-cell">
                  {t("admin.events.createdOn")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.elements.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="max-w-56 font-medium whitespace-normal">
                    <Link href={`/e/${e.id}`} className="hover:underline">
                      {e.name}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {e.pageName}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <ShortDate iso={e.startsAt} />
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        e.status === "cancelled"
                          ? "destructive"
                          : e.status === "updated"
                            ? "outline"
                            : "secondary"
                      }
                    >
                      {t(`statuses.${e.status as "published"}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <ShortDate iso={e.createdAt} />
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
 * Les paramètres d'URL et la session sont lus dans Evenements, derrière ce
 * Suspense : le cadre de la page reste instantané (Cache Components).
 */
export default function Page(props: PageProps<"/admin/events">) {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <AdminEventList {...props} />
    </Suspense>
  );
}
