"use client";

import {
  FlagIcon,
  LanguagesIcon,
  LogInIcon,
  LogOutIcon,
  EllipsisIcon,
  ShieldIcon,
  UserIcon,
  UserPlusIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { changerLangue } from "@/shared/i18n/actions";
import { cn } from "@/shared/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { LIBELLE_BARRE } from "./classes-barre";

/**
 * Menu « Plus » en bas de la barre latérale, comme le ☰ d'Instagram :
 * compte, langue (D2), administration et déconnexion.
 */
export function MenuPlus({
  connecte,
  estAdmin,
  deconnecter,
}: {
  connecte: boolean;
  estAdmin: boolean;
  deconnecter: () => Promise<void>;
}) {
  const t = useTranslations();
  const langue = useLocale();
  const router = useRouter();
  const [, demarrer] = useTransition();
  const autre = langue === "fr" ? "en" : "fr";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("nav.plus")}
        className="flex h-11 w-full items-center gap-3 rounded-lg px-3 text-left outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:size-6 [&_svg]:shrink-0"
      >
        <EllipsisIcon />
        <span className={cn("text-base font-semibold", LIBELLE_BARRE)}>
          {t("nav.plus")}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" className="w-64">
        <DropdownMenuGroup>
          {connecte ? (
            <>
              <DropdownMenuItem render={<Link href="/profil" />}>
                <UserIcon /> {t("identite.monProfil")}
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/demande-page" />}>
                <FlagIcon /> {t("nav.demanderPage")}
              </DropdownMenuItem>
              {estAdmin && (
                <DropdownMenuItem render={<Link href="/admin" />}>
                  <ShieldIcon /> {t("nav.administration")}
                </DropdownMenuItem>
              )}
            </>
          ) : (
            <>
              <DropdownMenuItem render={<Link href="/connexion" />}>
                <LogInIcon /> {t("nav.connexion")}
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/inscription" />}>
                <UserPlusIcon /> {t("nav.inscription")}
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem
            lang={autre}
            onClick={() =>
              demarrer(async () => {
                await changerLangue(autre);
                router.refresh();
              })
            }
          >
            <LanguagesIcon />
            {autre === "fr" ? t("commun.francais") : t("commun.anglais")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {connecte && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => demarrer(() => deconnecter())}
              variant="destructive"
            >
              <LogOutIcon /> {t("nav.deconnexion")}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
