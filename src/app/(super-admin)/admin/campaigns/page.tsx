import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { campaignState } from "@/modules/campaigns";
import { campaignsAdmin } from "@/modules/campaigns/server";
import { getCurrentAdmin } from "@/modules/admin/server";
import {
  changeCampaignStatusAction,
  deleteCampaignAction,
} from "@/modules/admin/application/admin.actions";
import {
  AdminSkeleton,
  CampaignStatusControl,
  DeleteEventControl,
  EmptyState,
  ShortDate,
} from "@/spaces/super-admin";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

async function AdminCampaignList() {
  const t = await getTranslations("admin.campaigns");
  if (!(await getCurrentAdmin())) return null;
  const campaigns = await campaignsAdmin.list();
  const now = new Date();
  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">{t("back")}</h1>
        <Button render={<Link href="/admin/campaigns/new" />}>
          {t("new")}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">{t("help")}</p>
      {campaigns.length === 0 ? (
        <EmptyState message={t("empty")} />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("columnTitle")}</TableHead>
                <TableHead className="hidden sm:table-cell">
                  {t("columnSponsor")}
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  {t("columnPeriod")}
                </TableHead>
                <TableHead>{t("columnStatus")}</TableHead>
                <TableHead>
                  <span className="sr-only">{t("activate")}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((c) => {
                const state = campaignState(c, now);
                return (
                  <TableRow key={c.id}>
                    <TableCell className="max-w-64 font-medium whitespace-normal">
                      <Link
                        href={`/admin/campaigns/${c.id}`}
                        className="hover:underline"
                      >
                        {c.title}
                      </Link>
                      <span className="block text-xs font-normal text-muted-foreground">
                        {t(`kinds.${c.kind}`)} ·{" "}
                        {c.placements
                          .map((p) => t(`placementNames.${p}`))
                          .join(", ")}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {c.sponsor.name ?? "—"}
                    </TableCell>
                    <TableCell className="hidden text-sm md:table-cell">
                      <ShortDate iso={c.startsAt} /> →{" "}
                      <ShortDate iso={c.endsAt} />
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={state === "running" ? "default" : "secondary"}
                      >
                        {t(`state.${state}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap items-center gap-2">
                        <CampaignStatusControl
                          status={c.status}
                          change={changeCampaignStatusAction.bind(null, c.id)}
                        />
                        <DeleteEventControl
                          scope="campaigns"
                          name={c.title}
                          remove={deleteCampaignAction.bind(null, c.id)}
                        />
                      </div>
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

/** La session est lue derrière ce Suspense : le cadre reste instantané. */
export default function Page() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <AdminCampaignList />
    </Suspense>
  );
}
