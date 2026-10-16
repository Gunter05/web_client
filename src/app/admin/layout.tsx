import { LogOutIcon, ShieldIcon, ShieldOffIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { type ReactNode, Suspense } from "react";
import { OngletsAdmin } from "@/modules/administration";
import { compteCourant } from "@/modules/identite/server";
import { Cloche } from "@/modules/notifications";
import { nombreNonLues } from "@/modules/notifications/server";
import { demandesEnAttente } from "@/modules/pages/server";
import { AvatarProfil } from "@/shared/composants/avatar-profil";
import { SelecteurLangue } from "@/shared/composants/selecteur-langue";
import { Button, buttonVariants } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { actionDeconnexion } from "../_actions/identite";
import {
  actionCompterNotifications,
  actionListerNotifications,
  actionMarquerNotificationsLues,
} from "../_actions/notifications";
import { adminCourant } from "./_coque/garde";
import { SqueletteAdmin } from "./_coque/squelette";

export const metadata: Metadata = {
  title: { default: "Administration", template: "%s · Administration" },
  // L'espace d'administration n'est jamais indexé.
  robots: { index: false, follow: false },
};

/**
 * Garde serveur (US-07) : connexion requise, puis rôle admin. Le contenu de
 * l'espace n'est rendu qu'une fois la garde passée.
 */
async function Garde({ children }: { children: ReactNode }) {
  if (!(await compteCourant())) redirect("/connexion?retour=/admin");
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
          href="/admin/demandes"
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
                nonLuesInitiales={nombreNonLues(admin.id)}
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
          <OngletsAdmin demandesEnAttente={demandesEnAttente().length} />
        </div>
      )}
    </>
  );
}

/** Espace Administration, séparé de l'espace public : en-tête et onglets propres. */
export default function LayoutAdmin({ children }: LayoutProps<"/admin">) {
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
