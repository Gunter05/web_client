"use client";

import { useCallback, useSyncExternalStore } from "react";
import { dismissKey } from "@/modules/campaigns/domain/campaign";

/**
 * Fermeture de la bannière d'une campagne, mémorisée dans ce navigateur.
 */
export const DISMISS_EVENT = "campaign-dismissed";

function subscribe(onChange: () => void) {
  window.addEventListener(DISMISS_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(DISMISS_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function read(id: string): boolean {
  try {
    return localStorage.getItem(dismissKey(id)) === "1";
  } catch {
    return false;
  }
}

export function useCampaignDismissal(id: string) {
  const dismissed = useSyncExternalStore(
    subscribe,
    () => read(id),
    // Côté serveur, masquée : évite un flash pour qui l'a déjà fermée.
    () => true,
  );
  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(dismissKey(id), "1");
    } catch {
      // Stockage indisponible (navigation privée) : fermée pour cette page.
    }
    window.dispatchEvent(new Event(DISMISS_EVENT));
  }, [id]);
  return { dismissed, dismiss };
}
