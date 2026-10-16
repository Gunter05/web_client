"use client";

import { PanelLeftIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, useSyncExternalStore } from "react";
import { cn } from "@/shared/lib/utils";

const CLE = "contineng:barre-reduite";
const EVENEMENT = "contineng:barre";

function lire(): boolean {
  try {
    return localStorage.getItem(CLE) === "1";
  } catch {
    return false; // Stockage indisponible : barre étendue.
  }
}

function abonner(rappel: () => void) {
  window.addEventListener("storage", rappel);
  window.addEventListener(EVENEMENT, rappel);
  return () => {
    window.removeEventListener("storage", rappel);
    window.removeEventListener(EVENEMENT, rappel);
  };
}

/**
 * Cadre de l'espace public : barre latérale étendue par défaut (modèle
 * TikTok), réductible aux icônes. Réduite, elle s'étend au survol.
 * Le choix est mémorisé dans ce navigateur.
 */
export function CadreCoque({
  logo,
  logoCourt,
  barre,
  children,
}: {
  logo: ReactNode;
  logoCourt: ReactNode;
  barre: ReactNode;
  children: ReactNode;
}) {
  const t = useTranslations("nav");
  const reduite = useSyncExternalStore(abonner, lire, () => false);

  function basculer() {
    try {
      localStorage.setItem(CLE, reduite ? "0" : "1");
    } catch {
      return;
    }
    window.dispatchEvent(new Event(EVENEMENT));
  }

  return (
    <div
      data-reduite={reduite}
      className={cn(
        "min-h-dvh transition-[padding] duration-200",
        reduite ? "md:pl-[72px]" : "md:pl-60",
      )}
    >
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden [scrollbar-width:none] flex-col overflow-x-hidden overflow-y-auto bg-background px-3 pt-5 pb-4 transition-[width,box-shadow] duration-200 ease-out md:flex",
          reduite
            ? "w-[72px] focus-within:w-60 focus-within:shadow-xl hover:w-60 hover:shadow-xl"
            : "w-60",
        )}
      >
        <div className="mb-4 flex h-10 items-center justify-between gap-2 pl-1.5">
          <span className="in-data-[reduite=false]:hidden in-[[data-reduite=true]_aside:focus-within]:hidden in-[[data-reduite=true]_aside:hover]:hidden">
            {logoCourt}
          </span>
          <span className="in-data-[reduite=true]:hidden in-[[data-reduite=true]_aside:focus-within]:block in-[[data-reduite=true]_aside:hover]:block">
            {logo}
          </span>
          <button
            type="button"
            onClick={basculer}
            aria-label={reduite ? t("etendre") : t("reduire")}
            aria-pressed={reduite}
            className="grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 in-data-[reduite=true]:hidden in-[[data-reduite=true]_aside:focus-within]:grid in-[[data-reduite=true]_aside:hover]:grid"
          >
            <PanelLeftIcon className="size-5" />
          </button>
        </div>
        {barre}
      </aside>
      {children}
    </div>
  );
}
