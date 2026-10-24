import { getTranslations } from "next-intl/server";
import { AuthCard, ForgotPasswordForm } from "@/modules/authentication";
import { forgotPasswordAction } from "@/modules/authentication/application/authentication.actions";
import { UrlToast } from "@/shared/components/UrlToast";
import { AuthLink } from "@/spaces/auth/components/AuthLink";

/** Mot de passe oublié : un lien est envoyé si l'adresse a un compte. */
export async function ForgotPasswordView() {
  const t = await getTranslations();
  return (
    <AuthCard
      title={t("auth.forgotPasswordTitle")}
      subtitle={t("auth.forgotPasswordSubtitle")}
      footer={<AuthLink href="/login">{t("auth.backToLogin")}</AuthLink>}
    >
      <UrlToast messages={{ resetLinkSent: t("auth.resetLinkSent") }} />
      <ForgotPasswordForm action={forgotPasswordAction} />
    </AuthCard>
  );
}
