"use client";

import { cn } from "@/shared/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SIDEBAR_LABEL } from "@/spaces/user/components/sidebar-classes";
import { useSidebarPanel } from "@/spaces/user/components/sidebar-panel";

/**
 * Onglet actif : icône pleine. Les traits intérieurs des icônes carrées
 * (le « + » de Créer) passent en couleur de fond pour rester visibles.
 */
const ACTIVE_ICON = "[&_svg]:fill-current [&_svg_rect~path]:stroke-background";

/** Entrée de navigation : barre latérale (icône + libellé) ou barre basse (icône). */
export function NavLink({
  href,
  icon,
  label,
  variant,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  variant: "sidebar" | "bottom";
}) {
  const path = usePathname();
  const { panel } = useSidebarPanel();
  const onPage = href === "/" ? path === "/" : path.startsWith(href);
  // Un tiroir ouvert (notifications, « Plus ») devient l'onglet actif.
  const active = onPage && !(variant === "sidebar" && panel);
  if (variant === "bottom") {
    return (
      <Link
        href={href}
        aria-label={label}
        aria-current={active ? "page" : undefined}
        className={cn(
          "grid flex-1 place-items-center py-3 [&_svg]:size-6",
          active ? cn("text-foreground", ACTIVE_ICON) : "text-foreground/80",
        )}
      >
        {icon}
      </Link>
    );
  }
  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-11 items-center gap-3 rounded-lg px-3 text-base transition-colors hover:bg-muted [&_svg]:size-6 [&_svg]:shrink-0",
        active && cn("font-semibold text-foreground", ACTIVE_ICON),
      )}
    >
      {icon}
      <span className={SIDEBAR_LABEL}>{label}</span>
    </Link>
  );
}
