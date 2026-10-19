"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * true une fois dans le navigateur. Sert aux affichages qui dépendent du
 * fuseau de l'appareil (D7), inconnus pendant le rendu serveur.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
