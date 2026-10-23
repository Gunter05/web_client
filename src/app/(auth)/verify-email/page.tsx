import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { AuthCard, VerifyEmailForm } from "@/modules/authentication";
import { verifyEmailAction } from "@/modules/authentication/application/authentication.actions";
import { ContentSkeleton } from "@/shared/components/layout/ContentSkeleton";

/** Lien reçu par e-mail : confirmer son adresse, d'un clic. */
async function VerifyEmail({ searchParams }: PageProps<"/verify-email">) {
  const { token } = await searchParams;
  const t = await getTranslations();
  return (
    <AuthCard
      title={t("auth.verifyEmailTitle")}
      subtitle={t("auth.verifyEmailSubtitle")}
      footer={
        <Link href="/" className="font-semibold text-foreground">
          {t("events.backToList")}
        </Link>
      }
    >
      {typeof token === "string" && token ? (
        <VerifyEmailForm action={verifyEmailAction} token={token} />
      ) : (
        <p className="text-sm text-destructive">{t("errors.invalidToken")}</p>
      )}
    </AuthCard>
  );
}

export default function Page(props: PageProps<"/verify-email">) {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <VerifyEmail {...props} />
    </Suspense>
  );
}
