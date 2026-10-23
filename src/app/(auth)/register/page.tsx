import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/modules/authentication";
import { getCurrentAccount } from "@/modules/authentication/server";
import { registerAction } from "@/modules/authentication/application/authentication.actions";
import { AuthCard } from "@/modules/authentication";
import { Suspense } from "react";
import { ContentSkeleton } from "@/shared/components/layout/ContentSkeleton";

/** Inscription ouverte à tous. */
async function Register({ searchParams }: PageProps<"/register">) {
  const { returnTo } = await searchParams;
  const target = typeof returnTo === "string" ? returnTo : "/";
  if (await getCurrentAccount())
    redirect(target.startsWith("/") ? target : "/");
  const t = await getTranslations();
  return (
    <AuthCard
      title={t("auth.registerTitle")}
      subtitle={t("auth.registerSubtitle")}
      footer={
        <>
          {t("auth.haveAccount")}{" "}
          <Link href="/login" className="font-semibold text-foreground">
            {t("nav.login")}
          </Link>
        </>
      }
    >
      <RegisterForm action={registerAction} returnTo={target} />
    </AuthCard>
  );
}

/**
 * Les paramètres d'URL et la session sont lus dans Inscription, derrière ce
 * Suspense : le cadre de la page reste instantané (Cache Components).
 */
export default function Page(props: PageProps<"/register">) {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <Register {...props} />
    </Suspense>
  );
}
