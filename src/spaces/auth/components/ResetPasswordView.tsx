import { getTranslations } from "next-intl/server";
import { AuthCard, ResetPasswordForm } from "@/modules/authentication";
import { resetPasswordAction } from "@/modules/authentication/application/authentication.actions";
import { AuthLink } from "@/spaces/auth/components/AuthLink";
import type { AuthSearchParams } from "@/spaces/auth/components/search-params";

/** Lien reçu par e-mail : choisir un nouveau mot de passe. */
export async function ResetPasswordView({
  searchParams,
}: {
  searchParams: AuthSearchParams;
}) {
  const { token } = await searchParams;
  const t = await getTranslations();
  return (
    <AuthCard
      title={t("auth.resetPasswordTitle")}
      footer={
        <AuthLink href="/forgot-password">{t("auth.askNewLink")}</AuthLink>
      }
    >
      {typeof token === "string" && token ? (
        <ResetPasswordForm action={resetPasswordAction} token={token} />
      ) : (
        <p className="text-sm text-destructive">{t("errors.invalidToken")}</p>
      )}
    </AuthCard>
  );
}
