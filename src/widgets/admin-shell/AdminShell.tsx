import { LogOutIcon, ShieldIcon, ShieldOffIcon } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { type ReactNode, Suspense } from "react";
import { OngletsAdmin } from "@/features/admin";
import { compteCourant } from "@/features/auth/server";
import { Cloche } from "@/features/notifications";
import { nombreNonLues } from "@/features/notifications/server";
import { demandesEnAttente } from "@/features/pages/server";
import { AvatarProfil } from "@/shared/components/AvatarProfil";
import { SelecteurLangue } from "@/shared/components/SelecteurLangue";
import { Button, buttonVariants } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { actionDeconnexion } from "@/features/auth/actions/auth.actions";
import {
  actionCompterNotifications,
  actionListerNotifications,
  actionMarquerNotificationsLues,
} from "@/features/notifications/actions/notifications.actions";
import { adminCourant } from "@/features/admin/server";
import { SqueletteAdmin } from "@/widgets/admin-shell/SqueletteAdmin";

/**
 * Garde serveur (US-07) : connexion requise, puis rôle admin. Le contenu de
 * l'espace n'est rendu qu'une fois la garde passée.
 */
async function Garde({ children }: { children: ReactNode }) {
  if (!(await compteCourant())) redirect("/login?retour=/admin");
  const admin = await adminCourant();
  if (admin) return children;
  const t = await getTranslations();
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <ShieldOffIcon className="size-12 text-destructive" />
      <h1 className="text-2xl font-bold">{t("admin.accesRefuse")}</h1>
      <p className="text-muted-foreground">{t("admin.accesRefuseDetail")}</p>
      <Link href="/" className={buttonVariants({ variant: "outline" })}>
        {t("evenements.retourListe")}
      </Link>
    </div>
  );
}

async function EnTete() {
  const admin = await adminCourant();
  const t = await getTranslations();
  return (
    <>
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4">
        <Link
          href="/admin/page-requests"
          className="flex items-center gap-2 font-semibold"
        >
          <span className="grid size-8 place-items-center rounded-lg degrade-marque text-white">
            <ShieldIcon className="size-4" />
          </span>
          <span className="hidden sm:inline">
            Le Contineng{" "}
            <span className="font-normal text-muted-foreground">
              · {t("admin.titre")}
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
            {t("admin.voirSitePublic")}
          </Link>
          <SelecteurLangue />
          {admin && (
            <>
              <Cloche
                nonLuesInitiales={await nombreNonLues()}
                actions={{
                  compter: actionCompterNotifications,
                  lister: actionListerNotifications,
                  marquerLues: actionMarquerNotificationsLues,
                }}
              />
              <AvatarProfil nom={admin.nom} photo={admin.photo} taille="sm" />
              <form action={actionDeconnexion}>
                <Button
                  variant="ghost"
                  size="icon"
                  type="submit"
                  aria-label={t("nav.deconnexion")}
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
          <OngletsAdmin
            demandesEnAttente={(await demandesEnAttente()).length}
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
          <EnTete />
        </Suspense>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Suspense fallback={<SqueletteAdmin />}>
          <Garde>{children}</Garde>
        </Suspense>
      </main>
    </div>
  );
}
