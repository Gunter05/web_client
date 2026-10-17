"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { cn } from "@/shared/lib/utils";
import { RECHERCHE_MAX } from "../domain/recherche";

/**
 * Champ de recherche façon Instagram (Explorer). La saisie est reprise dans
 * l'adresse (`?q=`) après une courte pause, pour qu'une recherche se partage.
 */
export function BarreRecherche({ valeur }: { valeur: string }) {
  const t = useTranslations("recherche");
  const router = useRouter();
  const chemin = usePathname();
  const params = useSearchParams();
  const [texte, setTexte] = useState(valeur);
  const [enCours, demarrer] = useTransition();

  useEffect(() => {
    if (texte.trim() === (params.get("q") ?? "")) return;
    const minuterie = setTimeout(() => {
      const suivants = new URLSearchParams(params);
      if (texte.trim()) suivants.set("q", texte.trim());
      else suivants.delete("q");
      const requete = suivants.toString().replaceAll("%2C", ",");
      demarrer(() =>
        router.replace(requete ? `${chemin}?${requete}` : chemin, {
          scroll: false,
        }),
      );
    }, 300);
    return () => clearTimeout(minuterie);
  }, [texte, params, chemin, router]);

  return (
    <div role="search" className="relative">
      <SearchIcon
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="search"
        value={texte}
        maxLength={RECHERCHE_MAX}
        onChange={(e) => setTexte(e.target.value)}
        placeholder={t("placeholder")}
        aria-label={t("placeholder")}
        aria-busy={enCours}
        autoComplete="off"
        className={cn(
          "h-10 w-full rounded-full bg-muted pr-10 pl-10 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-search-cancel-button]:hidden",
        )}
      />
      {texte && (
        <button
          type="button"
          onClick={() => setTexte("")}
          aria-label={t("effacer")}
          className="absolute top-1/2 right-3 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground"
        >
          <XIcon className="size-4" />
        </button>
      )}
    </div>
  );
}
