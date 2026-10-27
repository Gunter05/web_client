"use client";

import { useSyncExternalStore } from "react";

const MINUTE = 60_000;

/** L'instant présent arrondi à la minute ; null pendant le rendu serveur. */
export function useNow(): number | null {
  return useSyncExternalStore(
    (onChange) => {
      const timer = window.setInterval(onChange, MINUTE);
      return () => window.clearInterval(timer);
    },
    () => Math.floor(Date.now() / MINUTE) * MINUTE,
    () => null,
  );
}
