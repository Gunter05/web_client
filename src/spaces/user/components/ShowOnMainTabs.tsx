"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { isMainTab } from "@/spaces/user/components/main-tabs";

/** N'affiche son contenu (la barre du bas) que sur les écrans principaux. */
export function ShowOnMainTabs({ children }: { children: ReactNode }) {
  return isMainTab(usePathname()) ? children : null;
}
