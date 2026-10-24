import { DownloadIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { getActivity, getCurrentAdmin } from "@/modules/admin/server";
import { AdminSkeleton } from "@/spaces/super-admin";

/** Activité des visiteurs anonymes : jour, 7 et 30 jours, application installée. */
async function AdminActivity() {
  if (!(await getCurrentAdmin())) return null;
  const t = await getTranslations("admin");
  const activity = await getActivity();
  const periods = [
    { key: "today", value: activity.today },
    { key: "week", value: activity.week },
    { key: "month", value: activity.month },
  ] as const;
  return (
    <section className="grid gap-4">
      <div className="grid gap-1">
        <h1 className="text-xl font-semibold">{t("tabs.activity")}</h1>
        <p className="text-sm text-muted-foreground">{t("activity.intro")}</p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-3">
        {periods.map(({ key, value }) => (
          <li key={key} className="grid gap-1 rounded-xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">
              {t(`activity.${key}`)}
            </p>
            <p className="text-3xl font-semibold tabular-nums">
              {value.visitors}
              <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                {t("activity.visitors", { n: value.visitors })}
              </span>
            </p>
            <p className="text-sm">
              {t("activity.installedApp", { n: value.installedApp })}
            </p>
          </li>
        ))}
      </ul>
      <div className="grid gap-2 rounded-xl border bg-card p-4">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <DownloadIcon className="size-4" /> {t("activity.installs")}
        </p>
        <p className="text-3xl font-semibold tabular-nums">
          {activity.installs.total}
        </p>
        <p className="text-sm">
          {t("activity.installsDetail", {
            week: activity.installs.week,
            month: activity.installs.month,
          })}
        </p>
        <p className="text-xs text-muted-foreground">
          {t("activity.installsHelp")}
        </p>
      </div>
      <p className="text-xs text-muted-foreground">{t("activity.timezone")}</p>
    </section>
  );
}

/** La session est lue derrière ce Suspense (Cache Components). */
export default function Page() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <AdminActivity />
    </Suspense>
  );
}
