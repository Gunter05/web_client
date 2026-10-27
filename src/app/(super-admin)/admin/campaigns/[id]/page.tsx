import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { CampaignForm, campaignState } from "@/modules/campaigns";
import { campaignsAdmin } from "@/modules/campaigns/server";
import { getCurrentAdmin } from "@/modules/admin/server";
import {
  changeCampaignStatusAction,
  saveCampaignAction,
} from "@/modules/admin/application/admin.actions";
import {
  AdminSkeleton,
  CampaignStatusControl,
  loadCampaignOptions,
} from "@/spaces/super-admin";
import { Badge } from "@/shared/ui/badge";

async function EditCampaign({ params }: PageProps<"/admin/campaigns/[id]">) {
  const t = await getTranslations("admin.campaigns");
  if (!(await getCurrentAdmin())) return null;
  const { id } = await params;
  const campaign = await campaignsAdmin.get(id);
  if (!campaign) notFound();
  const [stats, options] = await Promise.all([
    campaignsAdmin.stats(id),
    loadCampaignOptions(),
  ]);
  const state = campaignState(campaign, new Date());
  const totals = [
    ["impressions", stats.totals.impressions],
    ["clicks", stats.totals.clicks],
    ["uniqueDetailsClicks", stats.uniqueClicks.FLOATING_BOTTOM ?? 0],
    ["uniqueCardClicks", stats.uniqueClicks.FEED_TOP ?? 0],
    ["dismissals", stats.totals.dismissals],
  ] as const;
  return (
    <section className="grid gap-6">
      <Link
        href="/admin/campaigns"
        className="text-sm text-muted-foreground hover:underline"
      >
        ← {t("back")}
      </Link>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-semibold">{t("edit")}</h1>
        <Badge variant={state === "running" ? "default" : "secondary"}>
          {t(`state.${state}`)}
        </Badge>
        <CampaignStatusControl
          status={campaign.status}
          change={changeCampaignStatusAction.bind(null, campaign.id)}
        />
      </div>

      <div className="grid gap-2">
        <h2 className="font-semibold">{t("stats")}</h2>
        {stats.days.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("noStats")}</p>
        ) : (
          <dl className="grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-5">
            {totals.map(([key, value]) => (
              <div key={key} className="rounded-lg border bg-card p-3">
                <dt className="text-xs text-muted-foreground">{t(key)}</dt>
                <dd className="text-xl font-semibold tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <CampaignForm
        campaign={campaign}
        options={options}
        action={saveCampaignAction.bind(null, campaign.id)}
      />
    </section>
  );
}

export default function Page(props: PageProps<"/admin/campaigns/[id]">) {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <EditCampaign {...props} />
    </Suspense>
  );
}
