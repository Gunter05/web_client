import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { DemoAccounts, LoginForm } from "@/modules/auth";
import { getCurrentAccount } from "@/modules/auth/server";
import { loginAction } from "@/modules/auth/application/auth.actions";
import { AuthCard } from "@/modules/auth";
import { Suspense } from "react";
import { ContentSkeleton } from "@/shared/components/layout/ContentSkeleton";

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
