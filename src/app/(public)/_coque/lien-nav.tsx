"use client";

import { cn } from "@/shared/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Entrée de navigation : icône seule sur mobile et tablette, avec libellé sur grand écran. */
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
      aria-current={actif ? "page" : undefined}
      className={cn(
        "flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-accent [&_svg]:size-6",
        actif && "font-bold [&_svg]:stroke-[2.5]",
      )}
    >
      {icone}
      <span className="hidden text-base lg:inline">{libelle}</span>
    </Link>
  );
}
