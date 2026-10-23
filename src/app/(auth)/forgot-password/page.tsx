import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { AuthCard, ForgotPasswordForm } from "@/modules/authentication";
import { forgotPasswordAction } from "@/modules/authentication/application/authentication.actions";
import { UrlToast } from "@/shared/components/UrlToast";
import { ContentSkeleton } from "@/shared/components/layout/ContentSkeleton";

/** Mot de passe oublié : un lien est envoyé si l'adresse a un compte. */
async function ForgotPassword() {
  const t = await getTranslations();
  return (
    <AuthCard
      title={t("auth.forgotPasswordTitle")}
      subtitle={t("auth.forgotPasswordSubtitle")}
      footer={
        <Link href="/login" className="font-semibold text-foreground">
          {t("auth.backToLogin")}
        </Link>
      }
    >
      <UrlToast messages={{ resetLinkSent: t("auth.resetLinkSent") }} />
      <ForgotPasswordForm action={forgotPasswordAction} />
    </AuthCard>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <ForgotPassword />
    </Suspense>
  );
}
