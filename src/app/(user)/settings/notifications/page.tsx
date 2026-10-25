import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getCurrentAccount } from "@/modules/authentication/server";
import { PushToggle } from "@/modules/notifications";
import {
  registerPushDeviceAction,
  unregisterPushDeviceAction,
} from "@/modules/notifications/application/notifications.actions";
import { PageTitle } from "@/shared/components/layout/PageTitle";
import { ContentSkeleton } from "@/shared/components/layout/ContentSkeleton";

const pushActions = {
  register: registerPushDeviceAction,
  unregister: unregisterPushDeviceAction,
};

/** Notifications push de cet appareil (ADR 0017), depuis le menu « Plus ». */
async function Notifications() {
  if (!(await getCurrentAccount()))
    redirect("/login?returnTo=/settings/notifications");
  const t = await getTranslations("more");
  return (
    <div className="mx-auto grid max-w-xl gap-6 px-4 pt-6 md:pt-10">
      <PageTitle title={t("notifications")} returnTo="/more" />
      <PushToggle actions={pushActions} />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <Notifications />
    </Suspense>
  );
}
