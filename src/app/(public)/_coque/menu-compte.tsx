"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { AvatarProfil } from "@/shared/composants/avatar-profil";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

/**
 * Menu du compte dans l'en-tête mobile : avatar de la personne connectée et,
 * au clic, ses entrées (profil, pages, administration, déconnexion). Il n'y a
 * qu'un seul compte : on ne bascule plus d'un profil à l'autre.
 */
export function MenuCompte({
  nom,
  photo,
  children,
}: {
  nom: string;
  photo: string | null;
  children: ReactNode;
}) {
  const t = useTranslations("nav");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("profil")}
        className="rounded-full p-1 outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <AvatarProfil nom={nom} photo={photo} taille="sm" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>{children}</DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
