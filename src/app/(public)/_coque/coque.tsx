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
import { LIBELLE_BARRE, LienNav } from "./lien-nav";
import { MenuPlus } from "./menu-plus";
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
  const { t, etat, nonLues, liens } = await navigation();
  return (
    <>
      <nav aria-label={t("nav.principale")} className="my-auto grid gap-1">
        {liens.map((l) => (
          <LienNav key={l.href} {...l} variante="laterale" />
        ))}
        {etat && (
          <Cloche
            nonLuesInitiales={nonLues}
            actions={actionsNotifications}
            libelle
            classeLibelle={LIBELLE_BARRE}
          />
        )}
        {etat && (
          <SelecteurProfil
            actif={etat.actif}
            profils={etat.profils}
            choisir={actionChoisirProfil}
            libelle={t("nav.profil")}
            classeLibelle={LIBELLE_BARRE}
          />
        )}
      </nav>
      <MenuPlus
        connecte={!!etat}
        estAdmin={etat?.estAdmin ?? false}
        deconnecter={actionDeconnexion}
      />
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
    <div className="min-h-dvh md:pl-[72px]">
      {/*
        Barre latérale réduite (icônes), étendue au survol ou au focus
        clavier, par-dessus le contenu, comme sur Instagram.
      */}
      <aside className="group/barre fixed inset-y-0 left-0 z-40 hidden w-[72px] flex-col overflow-hidden border-r bg-background px-3 py-6 transition-[width,box-shadow] duration-200 ease-out focus-within:w-60 focus-within:shadow-xl hover:w-60 hover:shadow-xl md:flex">
        <div className="flex h-12 items-center px-1.5">
          <span className="group-focus-within/barre:hidden group-hover/barre:hidden">
            <Logo court />
          </span>
          <span className="hidden group-focus-within/barre:block group-hover/barre:block">
            <Logo />
          </span>
        </div>
        <Suspense fallback={<Skeleton className="my-auto h-64 w-full" />}>
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
