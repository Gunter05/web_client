"use client";

import { ChevronDownIcon, RotateCcwIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useTransition } from "react";
import { AvatarProfil } from "@/shared/composants/avatar-profil";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import type { PageResumee } from "../domain/affichage";
import { CATEGORIES, FILTRES_PAR_DEFAUT, PERIODES } from "../domain/evenement";
import {
  ecrireFiltresUrl,
  estParDefaut,
  type FiltresUrl,
} from "../domain/filtres-url";

/**
 * Filtres Catégorie, Période et Page (US-17), utilisables sans connexion.
 * Chaque changement met à jour l'adresse : un lien filtré se partage.
 */
export function BarreFiltres({
  filtres,
  pages,
}: {
  filtres: FiltresUrl;
  pages: PageResumee[];
}) {
  const t = useTranslations();
  const router = useRouter();
  const chemin = usePathname();
  const [enCours, demarrer] = useTransition();

  const appliquer = (suivants: FiltresUrl) =>
    demarrer(() => {
      const requete = ecrireFiltresUrl(suivants);
      router.push(requete ? `${chemin}?${requete}` : chemin, { scroll: false });
    });

  function basculer<K extends keyof FiltresUrl>(
    cle: K,
    valeur: FiltresUrl[K][number],
  ) {
    const actuelles = filtres[cle] as string[];
    const suivantes = actuelles.includes(valeur)
      ? actuelles.filter((v) => v !== valeur)
      : [...actuelles, valeur];
    appliquer({ ...filtres, [cle]: suivantes });
  }

  const periodeModifiee = !estParDefaut({
    ...filtres,
    categories: [],
    pages: [],
  });

  return (
    <div
      className={cn(
        "-mx-4 flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0",
        enCours && "opacity-70",
      )}
      aria-busy={enCours}
    >
      <Filtre
        libelle={t("filtres.periode")}
        nombre={filtres.periodes.length}
        actif={periodeModifiee}
      >
        {PERIODES.map((p) => (
          <Option
            key={p}
            coche={filtres.periodes.includes(p)}
            onChange={() => basculer("periodes", p)}
          >
            {t(`periodes.${p}`)}
          </Option>
        ))}
      </Filtre>
      <Filtre
        libelle={t("filtres.categorie")}
        nombre={filtres.categories.length}
        actif={filtres.categories.length > 0}
      >
        {CATEGORIES.map((c) => (
          <Option
            key={c}
            coche={filtres.categories.includes(c)}
            onChange={() => basculer("categories", c)}
          >
            {t(`categories.${c}`)}
          </Option>
        ))}
      </Filtre>
      <Filtre
        libelle={t("filtres.page")}
        nombre={filtres.pages.length}
        actif={filtres.pages.length > 0}
      >
        {pages.map((p) => (
          <Option
            key={p.slug}
            coche={filtres.pages.includes(p.slug)}
            onChange={() => basculer("pages", p.slug)}
          >
            <AvatarProfil nom={p.nom} photo={p.photo} taille="xs" />
            {p.nom}
          </Option>
        ))}
      </Filtre>
      {!estParDefaut(filtres) && (
        <Button
          variant="ghost"
          size="sm"
          className="shrink-0 rounded-full"
          onClick={() =>
            appliquer({
              categories: [],
              periodes: [...FILTRES_PAR_DEFAUT.periodes],
              pages: [],
            })
          }
        >
          <RotateCcwIcon /> {t("filtres.reinitialiser")}
        </Button>
      )}
    </div>
  );
}

function Filtre({
  libelle,
  nombre,
  actif,
  children,
}: {
  libelle: string;
  nombre: number;
  actif: boolean;
  children: ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant={actif ? "default" : "outline"}
            size="sm"
            className="shrink-0 rounded-full"
          />
        }
      >
        {libelle}
        {actif && nombre > 0 && (
          <span className="rounded-full bg-primary-foreground/20 px-1.5 text-xs">
            {nombre}
          </span>
        )}
        <ChevronDownIcon />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 gap-0 p-1">
        <ul className="grid">{children}</ul>
      </PopoverContent>
    </Popover>
  );
}

function Option({
  coche,
  onChange,
  children,
}: {
  coche: boolean;
  onChange: () => void;
  children: ReactNode;
}) {
  return (
    <li>
      <label className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-sm hover:bg-muted">
        <Checkbox checked={coche} onCheckedChange={onChange} />
        {children}
      </label>
    </li>
  );
}
