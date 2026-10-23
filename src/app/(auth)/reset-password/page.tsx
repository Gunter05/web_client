import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { AuthCard, ResetPasswordForm } from "@/modules/authentication";
import { resetPasswordAction } from "@/modules/authentication/application/authentication.actions";
import { ContentSkeleton } from "@/shared/components/layout/ContentSkeleton";

/** Lien reçu par e-mail : choisir un nouveau mot de passe. */
async function ResetPassword({ searchParams }: PageProps<"/reset-password">) {
  const { token } = await searchParams;
  const t = await getTranslations();
  return (
    <AuthCard
      title={t("auth.resetPasswordTitle")}
      footer={
        <Link href="/forgot-password" className="font-semibold text-foreground">
          {t("auth.askNewLink")}
        </Link>
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

export default function Page(props: PageProps<"/reset-password">) {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <ResetPassword {...props} />
    </Suspense>
  );
}
