import { XCircleIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { getCurrentAccount } from "@/modules/authentication/server";
import { PendingPageRequest, PageRequestForm } from "@/modules/pages";
import { getLatestPageRequest } from "@/modules/pages/server";
import { UrlToast } from "@/shared/components/UrlToast";
import {
  requestPageAction,
  withdrawPageRequestAction,
} from "@/modules/pages/application/pages.actions";
import { PageTitle } from "@/shared/components/layout/PageTitle";
import { Suspense } from "react";
import { ContentSkeleton } from "@/shared/components/layout/ContentSkeleton";

/** Demander la création d'une page (US-03). */
async function PageRequest() {
  const account = await getCurrentAccount();
  if (!account) redirect("/login?returnTo=/page-request");
  const t = await getTranslations("pages.request");
  const latest = await getLatestPageRequest();

  return (
    <div className="mx-auto max-w-xl px-4 pt-6 md:pt-10">
      <UrlToast messages={{ sent: t("sent") }} />
      <PageTitle title={t("title")} subtitle={t("intro")} />
      {latest?.status === "pending" ? (
        <PendingPageRequest
          name={latest.name}
          submittedAt={latest.submittedAt}
          remove={withdrawPageRequestAction.bind(null, latest.id)}
        />
      ) : (
        <div className="grid gap-6">
          {latest?.status === "rejected" && (
            <div
              role="status"
              className="flex gap-3 rounded-xl border border-destructive/40 bg-danger-fond p-4 text-sm"
            >
              <XCircleIcon className="size-5 shrink-0 text-danger" />
              <div className="grid gap-1">
                <p>
                  {t("rejected", {
                    name: latest.name,
                    reason: latest.rejectionReason ?? "",
                  })}
                </p>
                <p className="text-muted-foreground">{t("newRequest")}</p>
              </div>
            </div>
          )}
          <PageRequestForm action={requestPageAction} />
        </div>
      )}
    </div>
  );
}

/** La session est lue dans DemandePage, derrière ce Suspense (Cache Components). */
export default function Page() {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <PageRequest />
    </Suspense>
  );
}
