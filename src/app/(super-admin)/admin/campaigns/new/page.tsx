import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { CampaignForm } from "@/modules/campaigns";
import { getCurrentAdmin } from "@/modules/admin/server";
import { saveCampaignAction } from "@/modules/admin/application/admin.actions";
import { AdminSkeleton, loadCampaignOptions } from "@/spaces/super-admin";

async function NewCampaign() {
  const t = await getTranslations("admin.campaigns");
  if (!(await getCurrentAdmin())) return null;
  const options = await loadCampaignOptions();
  return (
    <section className="grid gap-6">
      <Link
        href="/admin/campaigns"
        className="text-sm text-muted-foreground hover:underline"
      >
        ← {t("back")}
      </Link>
      <h1 className="text-xl font-semibold">{t("new")}</h1>
      <CampaignForm
        options={options}
        action={saveCampaignAction.bind(null, null)}
      />
    </section>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <NewCampaign />
    </Suspense>
  );
}
