import { EmptyState, Pagination, AdminSearch } from "@/spaces/super-admin";
import { listAccounts } from "@/modules/admin/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { getTranslations } from "next-intl/server";
import { ShortDate } from "@/spaces/super-admin";
import { getCurrentAdmin } from "@/modules/admin/server";
import { readSearchParams } from "@/modules/admin";
import { Suspense } from "react";
import { AdminSkeleton } from "@/spaces/super-admin";

async function AdminAccounts({ searchParams }: PageProps<"/admin/accounts">) {
  const t = await getTranslations();
  const { q, page } = readSearchParams(await searchParams);
  if (!(await getCurrentAdmin())) return null;
  const results = await listAccounts(q, page);
  return (
    <section className="grid gap-4">
      <h1 className="text-xl font-semibold">{t("admin.tabs.accounts")}</h1>
      <AdminSearch value={q} placeholder={t("admin.accounts.search")} />
      {results.total === 0 ? (
        <EmptyState
          message={q ? t("admin.noResults") : t("admin.accounts.empty")}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("auth.name")}</TableHead>
                <TableHead>{t("auth.email")}</TableHead>
                <TableHead className="hidden sm:table-cell">
                  {t("admin.accounts.createdOn")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.elements.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="max-w-40 truncate">{c.email}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <ShortDate iso={c.createdAt} />
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
 * Les paramètres d'URL et la session sont lus dans Comptes, derrière ce
 * Suspense : le cadre de la page reste instantané (Cache Components).
 */
export default function Page(props: PageProps<"/admin/accounts">) {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <AdminAccounts {...props} />
    </Suspense>
  );
}
