import { EmptyState } from "@/spaces/super-admin";
import { getPendingPageRequests } from "@/modules/pages/server";
import { ProfileAvatar } from "@/shared/components/ProfileAvatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { UrlToast } from "@/shared/components/UrlToast";
import { ChevronRightIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ShortDate } from "@/spaces/super-admin";
import { getCurrentAdmin } from "@/modules/admin/server";
import { Suspense } from "react";
import { AdminSkeleton } from "@/spaces/super-admin";

/** Demandes en attente, de la plus ancienne à la plus récente (US-03). */
async function PageRequestList() {
  const t = await getTranslations();
  if (!(await getCurrentAdmin())) return null;
  const pageRequests = await getPendingPageRequests();
  return (
    <section className="grid gap-4">
      <UrlToast
        messages={{
          accepted: t("admin.pageRequests.accepted"),
          rejected: t("admin.pageRequests.rejected"),
        }}
      />
      <h1 className="text-xl font-semibold">{t("admin.tabs.pageRequests")}</h1>
      {pageRequests.length === 0 ? (
        <EmptyState message={t("admin.pageRequests.empty")} />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("pages.request.name")}</TableHead>
                <TableHead>{t("admin.pageRequests.requester")}</TableHead>
                <TableHead className="hidden sm:table-cell">
                  {t("admin.pageRequests.submittedOn")}
                </TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRequests.map((d) => {
                const requester = d.requester;
                return (
                  <TableRow key={d.id} className="relative">
                    <TableCell className="font-medium">
                      <Link
                        href={`/admin/page-requests/${d.id}`}
                        className="after:absolute after:inset-0"
                      >
                        {d.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <ProfileAvatar
                          name={requester?.name ?? "?"}
                          photo={requester?.photoUrl ?? null}
                          size="xs"
                        />
                        {requester?.name}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <ShortDate iso={d.submittedAt} />
                    </TableCell>
                    <TableCell className="w-8">
                      <ChevronRightIcon className="size-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}

/** La session est lue dans Demandes, derrière ce Suspense (Cache Components). */
export default function Page() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <PageRequestList />
    </Suspense>
  );
}
