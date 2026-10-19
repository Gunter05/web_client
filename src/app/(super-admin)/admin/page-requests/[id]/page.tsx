import { getPageRequestById } from "@/modules/pages/server";
import { PageRequestDecision } from "@/modules/pages";
import { ProfileAvatar } from "@/shared/components/ProfileAvatar";
import { Badge } from "@/shared/ui/badge";
import { buttonVariants } from "@/shared/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Suspense } from "react";
import {
  acceptPageRequestAction,
  rejectPageRequestAction,
} from "@/modules/admin/application/admin.actions";
import { ShortDate } from "@/spaces/super-admin";
import { getCurrentAdmin } from "@/modules/admin/server";
import { AdminSkeleton } from "@/spaces/super-admin";

/** Formulaire complet d'une demande et décision (US-03). */
async function PageRequestDetails({
  params,
}: PageProps<"/admin/page-requests/[id]">) {
  const t = await getTranslations();
  if (!(await getCurrentAdmin())) return null;
  const pageRequest = await getPageRequestById((await params).id);
  if (!pageRequest) notFound();
  const requester = pageRequest.requester;
  return (
    <section className="grid max-w-2xl gap-6">
      <Link
        href="/admin/page-requests"
        className={buttonVariants({
          variant: "ghost",
          size: "sm",
          className: "justify-self-start",
        })}
      >
        <ArrowLeftIcon /> {t("admin.tabs.pageRequests")}
      </Link>
      <div className="grid gap-6 rounded-xl border bg-card p-6">
        <div className="flex items-center gap-4">
          <ProfileAvatar
            name={pageRequest.name}
            photo={pageRequest.photoUrl}
            size="lg"
          />
          <div className="grid gap-1">
            <h1 className="text-xl font-semibold">{pageRequest.name}</h1>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {t(`pages.types.${pageRequest.type}`)}
              </Badge>
              <Badge variant="outline">
                {t(`admin.pageRequests.status.${pageRequest.status}`)}
              </Badge>
            </div>
          </div>
        </div>
        <dl className="grid gap-4 text-sm">
          <Row label={t("admin.pageRequests.requester")}>
            <span className="flex items-center gap-2">
              <ProfileAvatar
                name={requester?.name ?? "?"}
                photo={requester?.photoUrl ?? null}
                size="xs"
              />{" "}
              {requester?.name}
            </span>
          </Row>
          <Row label={t("admin.pageRequests.submittedOn")}>
            <ShortDate iso={pageRequest.submittedAt} />
          </Row>
          <Row label={t("pages.request.description")}>
            <p className="whitespace-pre-line">{pageRequest.description}</p>
          </Row>
          <Row label={t("pages.request.justification")}>
            <p className="whitespace-pre-line">{pageRequest.justification}</p>
          </Row>
          {pageRequest.rejectionReason && (
            <Row label={t("admin.pageRequests.rejectionReason")}>
              {pageRequest.rejectionReason}
            </Row>
          )}
        </dl>
        {pageRequest.status === "pending" ? (
          <PageRequestDecision
            requestId={pageRequest.id}
            accept={acceptPageRequestAction.bind(null, pageRequest.id)}
            reject={rejectPageRequestAction}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("admin.pageRequests.alreadyReviewed")}
          </p>
        )}
      </div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1">
      <dt className="text-xs font-medium text-muted-foreground uppercase">
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}

/**
 * Les paramètres d'URL et la session sont lus dans Demande, derrière ce
 * Suspense : le cadre de la page reste instantané (Cache Components).
 */
export default function Page(props: PageProps<"/admin/page-requests/[id]">) {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <PageRequestDetails {...props} />
    </Suspense>
  );
}
