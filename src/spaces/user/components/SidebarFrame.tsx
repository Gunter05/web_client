"use client";

import { PanelLeftIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, useState, useSyncExternalStore } from "react";
import { cn } from "@/shared/lib/utils";

const KEY = "contineng:sidebar-collapsed";
const EVENT = "contineng:barre";

function read(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false; // Stockage indisponible : barre étendue.
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

/**
 * Cadre de l'espace public : barre latérale étendue par défaut (modèle
 * TikTok), réductible aux icônes. Réduite, elle s'étend au survol.
 * Le choix est mémorisé dans ce navigateur.
 */
export function SidebarFrame({
  logo,
  compactLogo,
  sidebar,
  children,
}: {
  logo: ReactNode;
  compactLogo: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
}) {
  const t = useTranslations("nav");
  const collapsed = useSyncExternalStore(subscribe, read, () => false);
  // Juste après « Réduire », la souris est encore sur la barre : sans ce
  // verrou, le survol la ré-étendrait aussitôt.
  const [hoverEnabled, setHoverEnabled] = useState(true);

  function toggle() {
    if (!collapsed) setHoverEnabled(false);
    try {
      localStorage.setItem(KEY, collapsed ? "0" : "1");
    } catch {
      return;
    }
    window.dispatchEvent(new Event(EVENT));
  }

  return (
    <div
      data-collapsed={collapsed}
      className={cn(
        "min-h-dvh transition-[padding] duration-200",
        collapsed ? "md:pl-[72px]" : "md:pl-60",
      )}
    >
      <aside
        data-hover={hoverEnabled ? "enabled" : "paused"}
        onMouseLeave={() => setHoverEnabled(true)}
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden [scrollbar-width:none] flex-col overflow-x-hidden overflow-y-auto bg-background px-3 pt-5 pb-4 transition-[width] duration-200 ease-out md:flex",
          collapsed
            ? hoverEnabled
              ? "w-[72px] focus-within:w-60 hover:w-60"
              : "w-[72px]"
            : "w-60",
        )}
      >
        <div className="mb-4 flex h-10 items-center justify-between gap-2 pl-1.5">
          <span className="in-data-[collapsed=false]:hidden in-[[data-collapsed=true]_aside[data-hover=enabled]:focus-within]:hidden in-[[data-collapsed=true]_aside[data-hover=enabled]:hover]:hidden">
            {compactLogo}
          </span>
          <span className="in-data-[collapsed=true]:hidden in-[[data-collapsed=true]_aside[data-hover=enabled]:focus-within]:block in-[[data-collapsed=true]_aside[data-hover=enabled]:hover]:block">
            {logo}
          </span>
          <button
            type="button"
            onClick={toggle}
            aria-label={collapsed ? t("expand") : t("collapse")}
            aria-pressed={collapsed}
            className="grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 in-data-[collapsed=true]:hidden in-[[data-collapsed=true]_aside[data-hover=enabled]:focus-within]:grid in-[[data-collapsed=true]_aside[data-hover=enabled]:hover]:grid"
          >
            <PanelLeftIcon className="size-5" />
          </button>
        </div>
        {sidebar}
      </aside>
      {children}
    </div>
  );
}
