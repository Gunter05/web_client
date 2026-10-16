import {
  BarChart3Icon,
  FlagIcon,
  HomeIcon,
  LogOutIcon,
  PlusSquareIcon,
  ShieldIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { cache, type ReactNode, Suspense } from "react";
import { Cloche } from "@/modules/notifications";
import { nombreNonLues } from "@/modules/notifications/server";
import {
  AlerteAccesPerdu,
  BandeauPageActive,
  SelecteurProfil,
} from "@/modules/profil-actif";
import { SelecteurLangue } from "@/shared/composants/selecteur-langue";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";
import { DropdownMenuItem } from "@/shared/ui/dropdown-menu";
import { Skeleton } from "@/shared/ui/skeleton";
import { actionDeconnexion } from "../../_actions/identite";
import {
  actionCompterNotifications,
  actionListerNotifications,
  actionMarquerNotificationsLues,
} from "../../_actions/notifications";
import { actionChoisirProfil } from "../../_actions/profil";
import { acteurCourant, pageActive } from "../../_services/acteur";
import { LienNav } from "./lien-nav";
import { Logo } from "./logo";

const actionsNotifications = {
  compter: actionCompterNotifications,
  lister: actionListerNotifications,
  marquerLues: actionMarquerNotificationsLues,
};

/** Lit une fois par requête l'acteur, ses liens de navigation et son menu. */
const navigation = cache(async () => {
  const t = await getTranslations();
  const acteur = await acteurCourant();
  const etat = acteur?.etat ?? null;
  const page = pageActive(etat);
  const nonLues = etat ? nombreNonLues(etat.compteId) : 0;

  const liens = [
    { href: "/", icone: <HomeIcon />, libelle: t("nav.accueil") },
    ...(page
      ? [
          {
            href: "/evenements/nouveau",
            icone: <PlusSquareIcon />,
            libelle: t("nav.creer"),
          },
          {
            href: "/mes-evenements",
            icone: <BarChart3Icon />,
            libelle: t("nav.mesEvenements"),
          },
          ...(page.role === "proprietaire"
            ? [
                {
                  href: "/acces",
                  icone: <UsersIcon />,
                  libelle: t("nav.acces"),
                },
              ]
            : []),
        ]
      : etat
        ? [
            {
              href: "/demande-page",
              icone: <FlagIcon />,
              libelle: t("nav.demanderPage"),
            },
          ]
        : []),
  ];

  const menuProfil = etat && (
    <>
      <DropdownMenuItem render={<Link href="/profil" />}>
        <UserIcon /> {t("identite.monProfil")}
      </DropdownMenuItem>
      <DropdownMenuItem render={<Link href="/demande-page" />}>
        <FlagIcon /> {t("nav.demanderPage")}
      </DropdownMenuItem>
      {etat.estAdmin && (
        <DropdownMenuItem render={<Link href="/admin" />}>
          <ShieldIcon /> {t("nav.administration")}
        </DropdownMenuItem>
      )}
      <form action={actionDeconnexion}>
        <DropdownMenuItem
          render={<button type="submit" className="w-full" />}
          nativeButton
        >
          <LogOutIcon /> {t("nav.deconnexion")}
        </DropdownMenuItem>
      </form>
    </>
  );

  const selecteur = (compact: boolean) =>
    etat && (
      <SelecteurProfil
        actif={etat.actif}
        profils={etat.profils}
        choisir={actionChoisirProfil}
        pied={menuProfil}
        compact={compact}
      />
    );

  return { t, etat, page, nonLues, liens, selecteur };
});

async function NavLaterale() {
  const { t, etat, nonLues, liens, selecteur } = await navigation();
  return (
    <>
      <nav aria-label={t("nav.principale")} className="grid gap-1">
        {liens.map((l) => (
          <LienNav key={l.href} {...l} variante="laterale" />
        ))}
        {etat && (
          <>
            <Cloche
              nonLuesInitiales={nonLues}
              actions={actionsNotifications}
              libelle
              className="hidden lg:flex"
            />
            <Cloche
              nonLuesInitiales={nonLues}
              actions={actionsNotifications}
              className="lg:hidden"
            />
          </>
        )}
      </nav>
      <div className="mt-auto grid gap-2">
        <SelecteurLangue className="justify-start" />
        {etat ? (
          <>
            <span className="hidden lg:block">{selecteur(false)}</span>
            <span className="lg:hidden">{selecteur(true)}</span>
          </>
        ) : (
          <>
            <div className="hidden gap-2 lg:grid">
              <Link
                href="/connexion"
                className={buttonVariants({ size: "lg" })}
              >
                {t("nav.connexion")}
              </Link>
              <Link
                href="/inscription"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                {t("nav.inscription")}
              </Link>
            </div>
            <Link
              href="/connexion"
              aria-label={t("nav.connexion")}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-lg" }),
                "lg:hidden",
              )}
            >
              <UserIcon />
            </Link>
          </>
        )}
      </div>
    </>
  );
}

async function ActionsEntete() {
  const { t, etat, nonLues, selecteur } = await navigation();
  return etat ? (
    <>
      <Cloche nonLuesInitiales={nonLues} actions={actionsNotifications} />
      {selecteur(true)}
    </>
  ) : (
    <>
      <SelecteurLangue />
      <Link href="/connexion" className={buttonVariants({ size: "sm" })}>
        {t("nav.connexion")}
      </Link>
    </>
  );
}

async function Bandeau() {
  const { etat, page } = await navigation();
  return (
    <>
      {page && (
        <div className="sticky top-14 z-20 md:top-0">
          <BandeauPageActive
            nom={page.nom}
            photo={page.photo}
            choisir={actionChoisirProfil}
          />
        </div>
      )}
      <AlerteAccesPerdu nom={etat?.accesPerdu ?? null} />
    </>
  );
}

async function NavBasse() {
  const { t, etat, liens } = await navigation();
  return (
    <nav
      aria-label={t("nav.principale")}
      className="fixed inset-x-0 bottom-0 z-30 flex border-t bg-background pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      {liens.map((l) => (
        <LienNav key={l.href} {...l} variante="basse" />
      ))}
      <LienNav
        href={etat ? "/profil" : "/inscription"}
        icone={<UserIcon />}
        libelle={etat ? t("nav.profil") : t("nav.inscription")}
        variante="basse"
      />
    </nav>
  );
}

/**
 * Coque de l'espace public, inspirée d'Instagram : barre latérale sur
 * ordinateur, en-tête et barre de navigation basse sur téléphone. Le cadre
 * est statique ; ce qui dépend de la session arrive derrière des Suspense
 * (Cache Components, ADR 0004).
 */
export function Coque({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh md:pl-[72px] lg:pl-60">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[72px] flex-col border-r bg-background px-3 py-6 md:flex lg:w-60">
        <div className="mb-8 px-1.5">
          <span className="lg:hidden">
            <Logo court />
          </span>
          <span className="hidden lg:block">
            <Logo />
          </span>
        </div>
        <Suspense fallback={<Skeleton className="h-40 w-full" />}>
          <NavLaterale />
        </Suspense>
      </aside>

      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur md:hidden">
        <div className="flex h-14 items-center gap-2 px-4">
          <Logo />
          <div className="ml-auto flex items-center gap-1">
            <Suspense fallback={<Skeleton className="size-8 rounded-full" />}>
              <ActionsEntete />
            </Suspense>
          </div>
        </div>
      </header>

      <Suspense>
        <Bandeau />
      </Suspense>

      <main className="pb-20 md:pb-10">{children}</main>

      <Suspense>
        <NavBasse />
      </Suspense>
    </div>
  );
}
