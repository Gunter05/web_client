"use client";

import { DotsThreeIcon } from "@/shared/components/icons";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { SIDEBAR_LABEL } from "@/spaces/user/components/sidebar-classes";
import {
  drawerTriggerClass,
  SidebarDrawer,
} from "@/spaces/user/components/SidebarDrawer";
import { MoreSections } from "@/spaces/user/components/MoreSections";
import { useSidebarPanel } from "@/spaces/user/components/sidebar-panel";

/**
 * Entrée « Plus » de la barre latérale (modèle TikTok) : tiroir avec les
 * réglages (langue, D2 ; thème, ADR 0006), le compte (profil, page, administration) et la
 * connexion ou la déconnexion.
 */
export function MoreMenu({
  signedIn,
  isAdmin,
  logout,
}: {
  signedIn: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
}) {
  const t = useTranslations();
  const { panel, setPanel } = useSidebarPanel();
  const open = panel === "more";
  const trigger = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => setPanel(open ? null : "more")}
        aria-expanded={open}
        aria-label={t("nav.more")}
        className={drawerTriggerClass(open)}
      >
        <DotsThreeIcon />
        <span className={SIDEBAR_LABEL}>{t("nav.more")}</span>
      </button>

      <SidebarDrawer name="more" title={t("nav.more")} trigger={trigger}>
        <MoreSections signedIn={signedIn} isAdmin={isAdmin} logout={logout} />
      </SidebarDrawer>
    </>
  );
}
