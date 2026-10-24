import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import {
  AuthCard,
  DemoAccounts,
  GoogleSignInButton,
  LoginForm,
} from "@/modules/authentication";
import {
  getCurrentAccount,
  isGoogleSignInEnabled,
} from "@/modules/authentication/server";
import { loginAction } from "@/modules/authentication/application/authentication.actions";
import { UrlToast } from "@/shared/components/UrlToast";
import { env } from "@/shared/config/env";
import { AuthLink } from "@/spaces/auth/components/AuthLink";
import {
  returnPath,
  type AuthSearchParams,
} from "@/spaces/auth/components/search-params";

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

/** Connexion, en page (/login) ou en modal par-dessus la page en cours. */
export async function LoginView({
  searchParams,
}: {
  searchParams: AuthSearchParams;
}) {
  const { returnTo, error: errorParam } = await searchParams;
  const error = googleError(errorParam);
  const target = returnPath(returnTo);
  if (await getCurrentAccount()) redirect(target);
  const t = await getTranslations();
  return (
    <AuthCard
      title={t("auth.login")}
      footer={
        <>
          {t("auth.noAccount")}{" "}
          <AuthLink href={`/register?returnTo=${encodeURIComponent(target)}`}>
            {t("nav.register")}
          </AuthLink>
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
