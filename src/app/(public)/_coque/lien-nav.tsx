"use client";

import { cn } from "@/shared/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Libellé d'une entrée de la barre latérale : masqué quand la barre est
 * réduite, visible au survol ou au focus clavier (groupe `barre`).
 */
export const LIBELLE_BARRE =
  "hidden whitespace-nowrap group-hover/barre:inline group-focus-within/barre:inline";

/** Entrée de navigation : barre latérale (icône + libellé) ou barre basse (icône). */
export function LienNav({
  href,
  icone,
  libelle,
  variante,
}: {
  href: string;
  icone: ReactNode;
  libelle: string;
  variante: "laterale" | "basse";
}) {
  const chemin = usePathname();
  const actif = href === "/" ? chemin === "/" : chemin.startsWith(href);
  if (variante === "basse") {
    return (
      <Link
        href={href}
        aria-label={libelle}
        aria-current={actif ? "page" : undefined}
        className={cn(
          "grid flex-1 place-items-center py-3 [&_svg]:size-6",
          actif ? "text-foreground [&_svg]:stroke-[2.5]" : "text-foreground/80",
        )}
      >
        {icone}
      </Link>
    );
  }
  return (
    <Link
      href={href}
      aria-label={libelle}
      aria-current={actif ? "page" : undefined}
      className={cn(
        "flex h-12 items-center gap-4 rounded-lg px-3 transition-colors hover:bg-muted [&_svg]:size-6 [&_svg]:shrink-0",
        actif && "font-bold [&_svg]:stroke-[2.5]",
      )}
    >
      {icone}
      <span className={cn("text-base", LIBELLE_BARRE)}>{libelle}</span>
    </Link>
  );
}
