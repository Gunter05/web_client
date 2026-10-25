import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SessionList } from "@/modules/authentication";
import {
  getCurrentAccount,
  listSessions,
} from "@/modules/authentication/server";
import {
  revokeOtherSessionsAction,
  revokeSessionAction,
} from "@/modules/authentication/application/authentication.actions";
import { PageTitle } from "@/shared/components/layout/PageTitle";
import { ContentSkeleton } from "@/shared/components/layout/ContentSkeleton";

/** Appareils connectés au compte (ADR 0018), depuis le menu « Plus ». */
async function Devices() {
  if (!(await getCurrentAccount()))
    redirect("/login?returnTo=/settings/devices");
  const t = await getTranslations("more");
  const sessions = await listSessions();
  return (
    <div className="mx-auto grid max-w-xl gap-6 px-4 pt-6 md:pt-10">
      <PageTitle title={t("devices")} returnTo="/more" />
      <SessionList
        sessions={sessions}
        revoke={revokeSessionAction}
        revokeOthers={revokeOtherSessionsAction}
      />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <Devices />
    </Suspense>
  );
}
