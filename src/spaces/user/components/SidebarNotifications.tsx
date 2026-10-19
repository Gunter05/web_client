"use client";

import { BellIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import {
  type NotificationActions,
  NotificationList,
  UnreadBadge,
  useNotifications,
} from "@/modules/notifications";
import { SIDEBAR_LABEL } from "@/spaces/user/components/sidebar-classes";
import {
  drawerTriggerClass,
  SidebarDrawer,
} from "@/spaces/user/components/SidebarDrawer";
import { useSidebarPanel } from "@/spaces/user/components/sidebar-panel";

/** Entrée « Notifications » de la barre latérale : ouvre le tiroir des notifications. */
export function SidebarNotifications({
  initialUnread,
  actions,
}: {
  initialUnread: number;
  actions: NotificationActions;
}) {
  const t = useTranslations("notifications");
  const { unread, list, load } = useNotifications(initialUnread, actions);
  const { panel, setPanel } = useSidebarPanel();
  const open = panel === "notifications";
  const trigger = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => {
          if (!open) void load();
          setPanel(open ? null : "notifications");
        }}
        aria-expanded={open}
        aria-label={unread ? `${t("title")} (${unread})` : t("title")}
        className={drawerTriggerClass(open)}
      >
        <span className="relative">
          <BellIcon />
          <UnreadBadge count={unread} />
        </span>
        <span className={SIDEBAR_LABEL}>{t("title")}</span>
      </button>
      <SidebarDrawer name="notifications" title={t("title")} trigger={trigger}>
        <NotificationList list={list} onNavigate={() => setPanel(null)} />
      </SidebarDrawer>
    </>
  );
}
