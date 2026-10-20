"use client";

import { createContext, useContext } from "react";

/** Tiroirs qui s'ouvrent contre la barre latérale (un seul à la fois). */
export type SidebarPanel = "notifications" | "more";

/**
 * Tiroir ouvert à côté de la barre latérale, collé à son bord : il suit la
 * largeur de la barre, réduite ou étendue.
 */
export const SidebarPanelContext = createContext<{
  panel: SidebarPanel | null;
  setPanel: (panel: SidebarPanel | null) => void;
  collapsed: boolean;
}>({ panel: null, setPanel: () => {}, collapsed: false });

export function useSidebarPanel() {
  return useContext(SidebarPanelContext);
}
