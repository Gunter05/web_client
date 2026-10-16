"use client";

import { useSyncExternalStore } from "react";

const abonner = () => () => {};

/**
 * true une fois dans le navigateur. Sert aux affichages qui dépendent du
 * fuseau de l'appareil (D7), inconnus pendant le rendu serveur.
 */
export function useMonte(): boolean {
  return useSyncExternalStore(
    abonner,
    () => true,
    () => false,
  );
}
