import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { DemoAccounts, LoginForm } from "@/modules/authentication";
import { getCurrentAccount } from "@/modules/authentication/server";
import { loginAction } from "@/modules/authentication/application/authentication.actions";
import { AuthCard } from "@/modules/authentication";
import { Suspense } from "react";
import { ContentSkeleton } from "@/shared/components/layout/ContentSkeleton";
import { UrlToast } from "@/shared/components/UrlToast";

async function Login({ searchParams }: PageProps<"/login">) {
  const { returnTo } = await searchParams;
  const target = typeof returnTo === "string" ? returnTo : "/";
  if (await getCurrentAccount())
    redirect(target.startsWith("/") ? target : "/");
  const t = await getTranslations();
  return (
    <AuthCard
      title={t("auth.loginTitle")}
      footer={
        <>
          {t("auth.noAccount")}{" "}
          <Link
            href={`/register?returnTo=${encodeURIComponent(target)}`}
            className="font-semibold text-foreground"
          >
            {t("nav.register")}
          </Link>
        </>
      }
    >
      <UrlToast
        messages={{
          passwordReset: t("auth.passwordResetDone"),
          emailVerified: t("auth.emailVerified"),
        }}
      />
      <LoginForm action={loginAction} returnTo={target} />
      <DemoAccounts />
    </AuthCard>
  );
}

/**
 * Les paramètres d'URL et la session sont lus dans Connexion, derrière ce
 * Suspense : le cadre de la page reste instantané (Cache Components).
 */
export default function Page(props: PageProps<"/login">) {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <Login {...props} />
    </Suspense>
  );
}
