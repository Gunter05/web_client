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
import { changeLocale } from "@/shared/i18n/actions";
import { cn } from "@/shared/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { SIDEBAR_LABEL } from "@/spaces/user/components/sidebar-classes";

/**
 * Menu « Plus » en bas de la barre latérale, comme le ☰ d'Instagram :
 * compte, langue (D2), administration et déconnexion.
 */
export function MoreMenu({
  signedIn,
  isAdmin,
  logout,
}: {
  signedIn: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const autre = locale === "fr" ? "en" : "fr";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("nav.more")}
        className="flex h-11 w-full items-center gap-3 rounded-lg px-3 text-left outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:size-6 [&_svg]:shrink-0"
      >
        <EllipsisIcon />
        <span className={cn("text-base font-semibold", SIDEBAR_LABEL)}>
          {t("nav.more")}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" className="w-64">
        <DropdownMenuGroup>
          {signedIn ? (
            <>
              <DropdownMenuItem render={<Link href="/profile" />}>
                <UserIcon /> {t("auth.myProfile")}
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/page-request" />}>
                <FlagIcon /> {t("nav.requestPage")}
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem render={<Link href="/admin" />}>
                  <ShieldIcon /> {t("nav.admin")}
                </DropdownMenuItem>
              )}
            </>
          ) : (
            <>
              <DropdownMenuItem render={<Link href="/login" />}>
                <LogInIcon /> {t("nav.login")}
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/register" />}>
                <UserPlusIcon /> {t("nav.register")}
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem
            lang={autre}
            onClick={() =>
              startTransition(async () => {
                await changeLocale(autre);
                router.refresh();
              })
            }
          >
            <LanguagesIcon />
            {autre === "fr" ? t("common.french") : t("common.english")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {signedIn && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => startTransition(() => logout())}
              variant="destructive"
            >
              <LogOutIcon /> {t("nav.logout")}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
