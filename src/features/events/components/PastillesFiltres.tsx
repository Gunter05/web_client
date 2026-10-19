"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import {
  CATEGORIES,
  type Categorie,
  PERIODES,
  type Periode,
} from "@/features/events/lib/evenement";

/**
 * Filtres en pastilles, façon notifications TikTok : une ligne pour la
 * période (choix unique, « Tous » par défaut), une ligne pour les catégories
 * (choix multiple). Chaque pastille est un lien : l'état vit dans l'adresse.
 */
export function PastillesFiltres({
  periode,
  categories,
}: {
  periode: Periode | null;
  categories: Categorie[];
}) {
  const t = useTranslations();
  const chemin = usePathname();
  const params = useSearchParams();

  function lien(changer: (p: URLSearchParams) => void) {
    const suivants = new URLSearchParams(params);
    changer(suivants);
    const requete = suivants.toString().replaceAll("%2C", ",");
    return requete ? `${chemin}?${requete}` : chemin;
  }

  const versPeriode = (p: Periode | null) =>
    lien((s) => (p ? s.set("periode", p) : s.delete("periode")));

  const versCategorie = (c: Categorie) =>
    lien((s) => {
      const suivantes = categories.includes(c)
        ? categories.filter((x) => x !== c)
        : [...categories, c];
      if (suivantes.length) s.set("categorie", suivantes.join(","));
      else s.delete("categorie");
    });

  return (
    <div className="grid gap-2">
      <Rangee libelle={t("filtres.periode")}>
        <Pastille href={versPeriode(null)} active={periode === null}>
          {t("recherche.tous")}
        </Pastille>
        {PERIODES.map((p) => (
          <Pastille key={p} href={versPeriode(p)} active={periode === p}>
            {t(`periodes.${p}`)}
          </Pastille>
        ))}
      </Rangee>
      <Rangee libelle={t("filtres.categorie")}>
        {CATEGORIES.map((c) => (
          <Pastille
            key={c}
            href={versCategorie(c)}
            active={categories.includes(c)}
          >
            {t(`categories.${c}`)}
          </Pastille>
        ))}
      </Rangee>
    </div>
  );
}

function Rangee({
  libelle,
  children,
}: {
  libelle: string;
  children: ReactNode;
}) {
  return (
    <ul
      aria-label={libelle}
      className="-mx-4 flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
    >
      {children}
    </ul>
  );
}

function Pastille({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <li className="shrink-0">
      <Link
        href={href}
        scroll={false}
        aria-current={active ? "true" : undefined}
        className={cn(
          "inline-flex h-9 items-center rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-colors",
          active
            ? "bg-foreground text-background"
            : "bg-muted text-foreground hover:bg-accent",
        )}
      >
        {children}
      </Link>
    </li>
  );
}
