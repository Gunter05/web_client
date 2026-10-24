import { Suspense } from "react";
import { NotificationBell } from "@/modules/notifications";
import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";
import { changeLanguageAction } from "@/modules/profiles/application/profiles.actions";
import { ThemeSwitcher } from "@/shared/components/ThemeSwitcher";
import { Logo } from "@/shared/components/layout/Logo";
import { buttonVariants } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { AccountMenu } from "@/spaces/user/components/AccountMenu";
import {
  getNavigation,
  notificationActions,
} from "@/spaces/user/components/navigation";

async function MobileHeaderActions() {
  const { t, account, unread, accountMenu } = await getNavigation();
  return account ? (
    <>
      <NotificationBell initialUnread={unread} actions={notificationActions} />
      <AccountMenu name={account.name} photo={account.photoUrl}>
        {accountMenu}
      </AccountMenu>
    </>
  ) : (
    <>
      <ThemeSwitcher />
      <LanguageSwitcher change={changeLanguageAction} />
      {/* Lien classique : sur téléphone, la connexion s'ouvre en page entière,
          pas en modal (src/app/@auth) */}
      <a href="/login" className={buttonVariants({ size: "sm" })}>
        {t("nav.login")}
      </a>
    </>
  );
}

/**
 * En-tête sur téléphone : logo (sans le nom, faute de place), puis notifications et menu du compte (ou
 * thème, langue et connexion pour un visiteur).
 */
export function MobileHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur md:hidden">
      <div className="flex h-14 items-center gap-2 px-3 sm:px-4">
        {/* Logo seul : le nom de l'application ferait déborder l'en-tête. */}
        <Logo compact />
        <div className="ml-auto flex min-w-0 items-center gap-1">
          <Suspense fallback={<Skeleton className="size-8 rounded-full" />}>
            <MobileHeaderActions />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
