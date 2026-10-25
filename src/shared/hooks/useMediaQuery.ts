"use client";

import { useSyncExternalStore } from "react";

/**
 * Suit une media query CSS (« (min-width: 768px) »…). Faux pendant le rendu
 * serveur, à jour dès le navigateur et à chaque changement de taille.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
