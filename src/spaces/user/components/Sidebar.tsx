import Link from "next/link";
import { NotificationBell } from "@/modules/notifications";
import { logoutAction } from "@/modules/auth/application/auth.actions";
import { getFilterPages } from "@/modules/events/server";
import { ProfileAvatar } from "@/shared/components/ProfileAvatar";
import { MoreMenu } from "@/spaces/user/components/MoreMenu";
import { NavLink } from "@/spaces/user/components/NavLink";
import {
  getNavigation,
  notificationActions,
} from "@/spaces/user/components/navigation";
import {
  SIDEBAR_BLOCK,
  SIDEBAR_LABEL,
} from "@/spaces/user/components/sidebar-classes";

/**
 * Barre latérale sur ordinateur : liens de navigation, notifications,
 * profil, menu « Plus », puis la liste des pages du site.
 */
export async function Sidebar() {
  const { t, account, unread, links } = await getNavigation();
  const pages = await getFilterPages();
  const boldLabel = `font-semibold ${SIDEBAR_LABEL}`;
  return (
    <>
      <nav aria-label={t("nav.main")} className="grid gap-0.5">
        {links.map((l) => (
          <NavLink key={l.href} {...l} variant="sidebar" />
        ))}
        {account && (
          <NotificationBell
            initialUnread={unread}
            actions={notificationActions}
            label
            labelClassName={boldLabel}
          />
        )}
        {account && (
          <NavLink
            href="/profile"
            icon={
              <ProfileAvatar
                name={account.name}
                photo={account.photoUrl}
                size="xs"
                className="shrink-0"
              />
            }
            label={t("nav.profile")}
            variant="sidebar"
          />
        )}
        <MoreMenu
          signedIn={!!account}
          isAdmin={account?.isAdmin ?? false}
          logout={logoutAction}
        />
      </nav>

      {pages.length > 0 && (
        <section aria-labelledby="titre-pages" className={SIDEBAR_BLOCK}>
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
                  <ProfileAvatar
                    name={p.name}
                    photo={p.photoUrl}
                    size="sm"
                    ring
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">
                      {p.name}
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
