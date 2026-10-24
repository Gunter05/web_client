import { getTranslations } from "next-intl/server";
import { AuthCard, VerifyEmailForm } from "@/modules/authentication";
import { verifyEmailAction } from "@/modules/authentication/application/authentication.actions";
import { AuthLink } from "@/spaces/auth/components/AuthLink";
import type { AuthSearchParams } from "@/spaces/auth/components/search-params";

/** Lien reçu par e-mail : confirmer son adresse, d'un clic. */
export async function VerifyEmailView({
  searchParams,
}: {
  searchParams: AuthSearchParams;
}) {
  const { token } = await searchParams;
  const t = await getTranslations();
  return (
    <AuthCard
      title={t("auth.verifyEmailTitle")}
      subtitle={t("auth.verifyEmailSubtitle")}
      footer={<AuthLink href="/">{t("events.backToList")}</AuthLink>}
    >
      {typeof token === "string" && token ? (
        <VerifyEmailForm action={verifyEmailAction} token={token} />
      ) : (
        <p className="text-sm text-destructive">{t("errors.invalidToken")}</p>
      )}
    </AuthCard>
  );
}
