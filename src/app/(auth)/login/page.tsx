import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import {
  DemoAccounts,
  GoogleSignInButton,
  LoginForm,
} from "@/modules/authentication";
import {
  getCurrentAccount,
  isGoogleSignInEnabled,
} from "@/modules/authentication/server";
import { loginAction } from "@/modules/authentication/application/authentication.actions";
import { AuthCard } from "@/modules/authentication";
import { Suspense } from "react";
import { ContentSkeleton } from "@/shared/components/layout/ContentSkeleton";
import { UrlToast } from "@/shared/components/UrlToast";
import { env } from "@/shared/config/env";

const GOOGLE_ERRORS = [
  "googleFailed",
  "googleEmailNotVerified",
  "googleSignInUnavailable",
  "accountSuspended",
] as const;

function googleError(
  error: unknown,
): (typeof GOOGLE_ERRORS)[number] | undefined {
  return GOOGLE_ERRORS.find((code) => code === error);
}

async function Login({ searchParams }: PageProps<"/login">) {
  const { returnTo, error: errorParam } = await searchParams;
  const error = googleError(errorParam);
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
      {/* Échec du retour de Google (/auth/google/callback) */}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {t(`errors.${error}`)}
        </p>
      )}
      <LoginForm action={loginAction} returnTo={target} />
      {isGoogleSignInEnabled() && <GoogleSignInButton returnTo={target} />}
      {/* Comptes de test (ADR 0010) : jamais affichés en production */}
      {env.NODE_ENV !== "production" && <DemoAccounts />}
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
