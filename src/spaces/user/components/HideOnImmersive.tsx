"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { isImmersive } from "@/spaces/user/components/immersive-routes";

/** Masque son contenu (en-tête, barre du bas) sur les pages plein écran. */
export function HideOnImmersive({ children }: { children: ReactNode }) {
  return isImmersive(usePathname()) ? null : children;
}
