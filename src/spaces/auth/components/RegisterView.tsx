import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import {
  AuthCard,
  GoogleSignInButton,
  RegisterForm,
} from "@/modules/authentication";
import {
  getCurrentAccount,
  isGoogleSignInEnabled,
} from "@/modules/authentication/server";
import { registerAction } from "@/modules/authentication/application/authentication.actions";
import { AuthLink } from "@/spaces/auth/components/AuthLink";
import {
  returnPath,
  type AuthSearchParams,
} from "@/spaces/auth/components/search-params";

/** Inscription ouverte à tous, en page ou en modal. */
export async function RegisterView({
  searchParams,
}: {
  searchParams: AuthSearchParams;
}) {
  const { returnTo } = await searchParams;
  const target = returnPath(returnTo);
  if (await getCurrentAccount()) redirect(target);
  const t = await getTranslations();
  return (
    <AuthCard
      title={t("auth.registerTitle")}
      subtitle={t("auth.registerSubtitle")}
      footer={
        <>
          {t("auth.haveAccount")}{" "}
          <AuthLink href={`/login?returnTo=${encodeURIComponent(target)}`}>
            {t("nav.login")}
          </AuthLink>
        </>
      }
    >
      <RegisterForm action={registerAction} returnTo={target} />
      {isGoogleSignInEnabled() && <GoogleSignInButton returnTo={target} />}
    </AuthCard>
  );
}
