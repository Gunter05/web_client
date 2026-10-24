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
import { cache } from "react";
import { logoutAction } from "@/modules/authentication/application/authentication.actions";
import {
  countNotificationsAction,
  listNotificationsAction,
  markNotificationsReadAction,
} from "@/modules/notifications/application/notifications.actions";
import { countUnread } from "@/modules/notifications/server";
import { getCurrentUser } from "@/modules/pages/server";
import { ThemeSwitcher } from "@/shared/components/ThemeSwitcher";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/shared/ui/dropdown-menu";

/** Server Actions de la cloche de notifications. */
export const notificationActions = {
  count: countNotificationsAction,
  list: listNotificationsAction,
  markRead: markNotificationsReadAction,
};

/**
 * Lit une fois par requête la personne connectée et ses liens. « Créer » est
 * visible par tous : le choix de la page se fait à l'étape suivante.
 */
export const getNavigation = cache(async () => {
  const t = await getTranslations();
  const user = await getCurrentUser();
  const account = user?.account ?? null;
  const unread = account ? await countUnread() : 0;

  const links = [
    { href: "/", icon: <HomeIcon />, label: t("nav.home") },
    { href: "/search", icon: <SearchIcon />, label: t("nav.search") },
    {
      // Sans compte, la connexion s'ouvre en modal (une redirection du
      // serveur afficherait la page /login entière).
      href: account ? "/events/new" : "/login?returnTo=%2Fevents%2Fnew",
      icon: <PlusSquareIcon />,
      label: t("nav.create"),
    },
    ...(account
      ? [
          {
            href: "/my-pages",
            icon: <LayoutGridIcon />,
            label: t("nav.myPages"),
          },
        ]
      : []),
  ];

  const accountMenu = account && (
    <>
      <DropdownMenuItem render={<Link href="/profile" />}>
        <UserIcon /> {t("auth.myProfile")}
      </DropdownMenuItem>
      <DropdownMenuItem render={<Link href="/page-request" />}>
        <FlagIcon /> {t("nav.requestPage")}
      </DropdownMenuItem>
      {account.isAdmin && (
        <DropdownMenuItem render={<Link href="/admin" />}>
          <ShieldIcon /> {t("nav.admin")}
        </DropdownMenuItem>
      )}
      <DropdownMenuSeparator />
      <div className="flex items-center justify-between gap-3 px-2 py-1.5 text-sm">
        {t("theme.darkMode")}
        <ThemeSwitcher />
      </div>
      <DropdownMenuSeparator />
      <form action={logoutAction}>
        <DropdownMenuItem
          render={<button type="submit" className="w-full" />}
          nativeButton
        >
          <LogOutIcon /> {t("nav.logout")}
        </DropdownMenuItem>
      </form>
    </>
  );

  return { t, account, unread, links, accountMenu };
});
