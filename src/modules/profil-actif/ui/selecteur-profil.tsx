"use client";

import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { type ReactNode, useTransition } from "react";
import { AvatarProfil } from "@/shared/composants/avatar-profil";
import { cn } from "@/shared/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import type { Profil } from "../domain/profil";

export type ChoisirProfil = (pageId: string | null) => Promise<unknown>;

/**
 * Sélecteur de profil (US-37), façon « changer de compte » d'Instagram :
 * nom et photo du profil actif ; au clic, la liste de tous ses profils.
 */
export function SelecteurProfil({
  actif,
  profils,
  choisir,
  compact = false,
  libelle,
  classeLibelle,
  pied,
}: {
  actif: Profil;
  profils: Profil[];
  choisir: ChoisirProfil;
  compact?: boolean;
  /** Entrée de barre de navigation : avatar puis ce libellé (ex. « Profil »). */
  libelle?: string;
  classeLibelle?: string;
  pied?: ReactNode;
}) {
  const t = useTranslations("profilActif");
  const router = useRouter();
  const [enCours, demarrer] = useTransition();
  const selectionner = (profil: Profil) =>
    demarrer(async () => {
      await choisir(profil.type === "page" ? profil.id : null);
      router.refresh();
    });
  const sousTitre = (p: Profil) =>
    p.type === "page" ? t(p.role) : t("profilPersonnel");

  return (
    <DropdownMenu>
      {libelle ? (
        <DropdownMenuTrigger
          aria-label={t("changerDeProfil")}
          className={cn(
            "flex h-11 w-full items-center gap-3 rounded-lg px-3 text-left outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
            enCours && "opacity-60",
          )}
        >
          <AvatarProfil
            nom={actif.nom}
            photo={actif.photo}
            taille="xs"
            anneau={actif.type === "page"}
            className="shrink-0"
          />
          <span className={cn("truncate text-base", classeLibelle)}>
            {libelle}
          </span>
        </DropdownMenuTrigger>
      ) : (
        <DropdownMenuTrigger
          aria-label={t("changerDeProfil")}
          className={cn(
            "flex min-w-0 items-center gap-2 rounded-full p-1 text-left outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
            !compact && "w-full rounded-xl p-2",
            enCours && "opacity-60",
          )}
        >
          <AvatarProfil
            nom={actif.nom}
            photo={actif.photo}
            taille={compact ? "sm" : "md"}
            anneau={actif.type === "page"}
          />
          {!compact && (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">
                  {actif.nom}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {sousTitre(actif)}
                </span>
              </span>
              <ChevronDownIcon className="size-4 text-muted-foreground" />
            </>
          )}
        </DropdownMenuTrigger>
      )}
      <DropdownMenuContent
        align={compact || libelle ? "end" : "start"}
        side={libelle ? "right" : compact ? "bottom" : "top"}
        className="w-72"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("mesProfils")}</DropdownMenuLabel>
          {profils.map((profil) => (
            <DropdownMenuItem
              key={`${profil.type}-${profil.id}`}
              onClick={() => selectionner(profil)}
              className="gap-3 py-2"
            >
              <AvatarProfil
                nom={profil.nom}
                photo={profil.photo}
                taille="sm"
                anneau={profil.type === "page"}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{profil.nom}</span>
                <span className="block text-xs text-muted-foreground">
                  {sousTitre(profil)}
                </span>
              </span>
              {profil.type === actif.type && profil.id === actif.id && (
                <CheckIcon className="size-4" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        {pied && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>{pied}</DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
