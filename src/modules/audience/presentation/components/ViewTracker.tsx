"use client";

import { useEffect, useRef } from "react";

/**
 * Signale l'ouverture de la fiche depuis le navigateur : les robots d'aperçu
 * (WhatsApp, moteurs) n'exécutent pas ce code et ne sont pas comptés (US-39).
 */
export function ViewTracker({
  report,
}: {
  report: (fromShareLink: boolean) => Promise<void>;
}) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    const via =
      new URLSearchParams(window.location.search).get("via") === "partage";
    void report(via);
  }, [report]);
  return null;
}
