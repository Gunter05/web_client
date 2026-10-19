"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { ProfileAvatar } from "@/shared/components/ProfileAvatar";
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
export function AccountMenu({
  name,
  photo,
  children,
}: {
  name: string;
  photo: string | null;
  children: ReactNode;
}) {
  const t = useTranslations("nav");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("profile")}
        className="rounded-full p-1 outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <ProfileAvatar name={name} photo={photo} size="sm" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>{children}</DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
