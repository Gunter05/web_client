"use client";

import { useEffect } from "react";
import { visitKey } from "@/modules/audience/domain/visit";

const STORAGE_KEY = "contineng_visite";

/** Le site est ouvert comme application installée (PWA), y compris sur iPhone. */
function isInstalledApp(): boolean {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches === true ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/**
 * Activité des visiteurs, sans compte : signale une visite par jour et par
 * mode (navigateur ou application installée), et l'installation de
 * l'application quand le navigateur l'annonce (Chrome et Android). Exécuté
 * dans le navigateur seulement : les robots ne sont pas comptés.
 */
export function VisitTracker({
  visit,
  install,
}: {
  visit: (installedApp: boolean) => Promise<void>;
  install: () => Promise<void>;
}) {
  useEffect(() => {
    const installedApp = isInstalledApp();
    const key = visitKey(new Date(), installedApp);
    let last: string | null = null;
    try {
      last = localStorage.getItem(STORAGE_KEY);
    } catch {
      // Stockage indisponible (navigation privée) : la visite est envoyée, l'API dédoublonne
    }
    if (last !== key) {
      void visit(installedApp).then(() => {
        try {
          localStorage.setItem(STORAGE_KEY, key);
        } catch {}
      });
    }
    const onInstalled = () => void install();
    window.addEventListener("appinstalled", onInstalled);
    return () => window.removeEventListener("appinstalled", onInstalled);
  }, [visit, install]);
  return null;
}
