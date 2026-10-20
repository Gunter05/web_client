import { logoutAction } from "@/modules/auth/application/auth.actions";
import { ProfileAvatar } from "@/shared/components/ProfileAvatar";
import { MoreMenu } from "@/spaces/user/components/MoreMenu";
import { NavLink } from "@/spaces/user/components/NavLink";
import { SidebarNotifications } from "@/spaces/user/components/SidebarNotifications";
import {
  getNavigation,
  notificationActions,
} from "@/spaces/user/components/navigation";

/**
 * Barre latérale sur ordinateur : liens de navigation, notifications,
 * profil et menu « Plus ».
 */
export async function Sidebar() {
  const { t, account, unread, links } = await getNavigation();
  return (
    <>
      <nav aria-label={t("nav.main")} className="grid gap-0.5">
        {links.map((l) => (
          <NavLink key={l.href} {...l} variant="sidebar" />
        ))}
        {account && (
          <SidebarNotifications
            initialUnread={unread}
            actions={notificationActions}
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
    </>
  );
}
