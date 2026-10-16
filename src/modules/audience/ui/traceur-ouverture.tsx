"use client";

import { useEffect, useRef } from "react";

/**
 * Signale l'ouverture de la fiche depuis le navigateur : les robots d'aperçu
 * (WhatsApp, moteurs) n'exécutent pas ce code et ne sont pas comptés (US-39).
 */
export function TraceurOuverture({
  signaler,
}: {
  signaler: (viaLienPartage: boolean) => Promise<void>;
}) {
  const envoye = useRef(false);
  useEffect(() => {
    if (envoye.current) return;
    envoye.current = true;
    const via =
      new URLSearchParams(window.location.search).get("via") === "partage";
    void signaler(via);
  }, [signaler]);
  return null;
}
