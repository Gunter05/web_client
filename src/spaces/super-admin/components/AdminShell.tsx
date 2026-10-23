import { LogOutIcon, ShieldIcon, ShieldOffIcon } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { type ReactNode, Suspense } from "react";
import { AdminTabs } from "@/spaces/super-admin/components/AdminTabs";
import { getCurrentAccount } from "@/modules/authentication/server";
import { NotificationBell, PushSync } from "@/modules/notifications";
import { countUnread } from "@/modules/notifications/server";
import { getPendingPageRequests } from "@/modules/pages/server";
import { ProfileAvatar } from "@/shared/components/ProfileAvatar";
import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";
import { changeLanguageAction } from "@/modules/profiles/application/profiles.actions";
import { Button, buttonVariants } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { logoutAction } from "@/modules/authentication/application/authentication.actions";
import {
  countNotificationsAction,
  listNotificationsAction,
  markNotificationsReadAction,
  registerPushDeviceAction,
  unregisterPushDeviceAction,
} from "@/modules/notifications/application/notifications.actions";
import { getCurrentAdmin } from "@/modules/admin/server";
import { AdminSkeleton } from "@/spaces/super-admin/components/AdminSkeleton";

/**
 * Garde serveur (US-07) : connexion requise, puis rôle admin. Le contenu de
 * l'espace n'est rendu qu'une fois la garde passée.
 */
async function AdminGuard({ children }: { children: ReactNode }) {
  if (!(await getCurrentAccount())) redirect("/login?returnTo=/admin");
  const admin = await getCurrentAdmin();
  if (admin) {
    return (
      <>
        {children}
        {/* Les admins sont prévenus des nouvelles demandes de page (US-03) */}
        <PushSync
          actions={{
            register: registerPushDeviceAction,
            unregister: unregisterPushDeviceAction,
          }}
        />
      </>
    );
  }
  const t = await getTranslations();
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <ShieldOffIcon className="size-12 text-destructive" />
      <h1 className="text-2xl font-bold">{t("admin.accessDenied")}</h1>
      <p className="text-muted-foreground">{t("admin.accessDeniedDetail")}</p>
      <Link href="/" className={buttonVariants({ variant: "outline" })}>
        {t("events.backToList")}
      </Link>
    </div>
  );
}

async function AdminHeader() {
  const admin = await getCurrentAdmin();
  const t = await getTranslations();
  return (
    <>
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4">
        <Link
          href="/admin/page-requests"
          className="flex items-center gap-2 font-semibold"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <ShieldIcon className="size-4" />
          </span>
          <span className="hidden sm:inline">
            Le Contineng{" "}
            <span className="font-normal text-muted-foreground">
              · {t("admin.title")}
            </span>
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-1">
          <Link
            href="/"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "hidden sm:inline-flex",
            })}
          >
            {t("admin.viewSite")}
          </Link>
          <LanguageSwitcher change={changeLanguageAction} />
          {admin && (
            <>
              <NotificationBell
                initialUnread={await countUnread()}
                actions={{
                  count: countNotificationsAction,
                  list: listNotificationsAction,
                  markRead: markNotificationsReadAction,
                }}
              />
              <ProfileAvatar
                name={admin.name}
                photo={admin.photoUrl}
                size="sm"
              />
              <form action={logoutAction}>
                <Button
                  variant="ghost"
                  size="icon"
                  type="submit"
                  aria-label={t("nav.logout")}
                >
                  <LogOutIcon />
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
      {admin && (
        <div className="mx-auto max-w-6xl px-4">
          <AdminTabs
            pendingPageRequests={(await getPendingPageRequests()).length}
          />
        </div>
      )}
    </>
  );
}

/**
 * Coque de l'application Administration, séparée de celle du site : en-tête,
 * onglets propres et garde serveur (connexion puis rôle admin, US-07).
 */
export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-muted/30">
      <header className="sticky top-0 z-30 border-b bg-background">
        <Suspense fallback={<Skeleton className="mx-auto h-14 max-w-6xl" />}>
          <AdminHeader />
        </Suspense>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Suspense fallback={<AdminSkeleton />}>
          <AdminGuard>{children}</AdminGuard>
        </Suspense>
      </main>
    </div>
  );
}
