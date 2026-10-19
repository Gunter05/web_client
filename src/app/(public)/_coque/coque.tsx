import {
  FlagIcon,
  HomeIcon,
  LayoutGridIcon,
  LogOutIcon,
  PlusSquareIcon,
  SearchIcon,
  ShieldIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { cache, type ReactNode, Suspense } from "react";
import { Cloche } from "@/modules/notifications";
import { nombreNonLues } from "@/modules/notifications/server";
import { AvatarProfil } from "@/shared/composants/avatar-profil";
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
import { acteurCourant } from "../../_services/acteur";
import { pagesDuFiltre } from "../../_services/affichage";
import { CadreCoque } from "./cadre-coque";
import { BLOC_BARRE, LIBELLE_BARRE } from "./classes-barre";
import { LienNav } from "./lien-nav";
import { Logo } from "./logo";
import { MenuCompte } from "./menu-compte";
import { MenuPlus } from "./menu-plus";

const actionsNotifications = {
  compter: actionCompterNotifications,
  lister: actionListerNotifications,
  marquerLues: actionMarquerNotificationsLues,
};

/**
 * Lit une fois par requête la personne connectée et ses liens. « Créer » est
 * visible par tous : le choix de la page se fait à l'étape suivante.
 */
const navigation = cache(async () => {
  const t = await getTranslations();
  const acteur = await acteurCourant();
  const compte = acteur?.compte ?? null;
  const nonLues = compte ? await nombreNonLues() : 0;

  const liens = [
    { href: "/", icone: <HomeIcon />, libelle: t("nav.accueil") },
    { href: "/recherche", icone: <SearchIcon />, libelle: t("nav.rechercher") },
    {
      href: "/evenements/nouveau",
      icone: <PlusSquareIcon />,
      libelle: t("nav.creer"),
    },
    ...(compte
      ? [
          {
            href: "/mes-pages",
            icone: <LayoutGridIcon />,
            libelle: t("nav.mesPages"),
          },
        ]
      : []),
  ];

  const menuCompte = compte && (
    <>
      <DropdownMenuItem render={<Link href="/profil" />}>
        <UserIcon /> {t("identite.monProfil")}
      </DropdownMenuItem>
      <DropdownMenuItem render={<Link href="/demande-page" />}>
        <FlagIcon /> {t("nav.demanderPage")}
      </DropdownMenuItem>
      {compte.estAdmin && (
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

  return { t, compte, nonLues, liens, menuCompte };
});

async function NavLaterale() {
  const { t, compte, nonLues, liens } = await navigation();
  const pages = await pagesDuFiltre();
  const libelleGras = `font-semibold ${LIBELLE_BARRE}`;
  return (
    <>
      <nav aria-label={t("nav.principale")} className="grid gap-0.5">
        {liens.map((l) => (
          <LienNav key={l.href} {...l} variante="laterale" />
        ))}
        {compte && (
          <Cloche
            nonLuesInitiales={nonLues}
            actions={actionsNotifications}
            libelle
            classeLibelle={libelleGras}
          />
        )}
        {compte && (
          <LienNav
            href="/profil"
            icone={
              <AvatarProfil
                nom={compte.nom}
                photo={compte.photo}
                taille="xs"
                className="shrink-0"
              />
            }
            libelle={t("nav.profil")}
            variante="laterale"
          />
        )}
        <MenuPlus
          connecte={!!compte}
          estAdmin={compte?.estAdmin ?? false}
          deconnecter={actionDeconnexion}
        />
      </nav>

      {pages.length > 0 && (
        <section aria-labelledby="titre-pages" className={BLOC_BARRE}>
          <hr className="mx-3 my-4 border-border" />
          <h2
            id="titre-pages"
            className="px-3 pb-2 text-sm font-semibold text-muted-foreground"
          >
            {t("nav.pages")}
          </h2>
          <ul className="grid gap-0.5">
            {pages.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/p/${p.slug}`}
                  className="flex items-center gap-3 rounded-lg px-3 py-1.5 hover:bg-muted"
                >
                  <AvatarProfil
                    nom={p.nom}
                    photo={p.photo}
                    taille="sm"
                    anneau
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">
                      {p.nom}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      @{p.slug}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

async function ActionsEntete() {
  const { t, compte, nonLues, menuCompte } = await navigation();
  return compte ? (
    <>
      <Cloche nonLuesInitiales={nonLues} actions={actionsNotifications} />
      <MenuCompte nom={compte.nom} photo={compte.photo}>
        {menuCompte}
      </MenuCompte>
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

async function NavBasse() {
  const { t, compte, liens } = await navigation();
  return (
    <nav
      aria-label={t("nav.principale")}
      className="fixed inset-x-0 bottom-0 z-30 flex border-t bg-background pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      {liens.map((l) => (
        <LienNav key={l.href} {...l} variante="basse" />
      ))}
      <LienNav
        href={compte ? "/profil" : "/inscription"}
        icone={<UserIcon />}
        libelle={compte ? t("nav.profil") : t("nav.inscription")}
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
    <CadreCoque
      logo={<Logo />}
      logoCourt={<Logo court />}
      barre={
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <NavLaterale />
        </Suspense>
      }
    >
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

      <main className="pb-20 md:pb-10">{children}</main>

      <Suspense>
        <NavBasse />
      </Suspense>
    </CadreCoque>
  );
}
