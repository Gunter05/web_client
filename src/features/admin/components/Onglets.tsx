"use client";

import { cn } from "@/shared/lib/utils";
import { CalendarDaysIcon, FlagIcon, InboxIcon, UsersIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ONGLETS = [
  { href: "/admin/page-requests", cle: "demandes", icone: InboxIcon },
  { href: "/admin/accounts", cle: "comptes", icone: UsersIcon },
  { href: "/admin/pages", cle: "pages", icone: FlagIcon },
  { href: "/admin/events", cle: "evenements", icone: CalendarDaysIcon },
] as const;

/** Les quatre onglets de l'espace Administration (US-07). */
export function OngletsAdmin({
  demandesEnAttente,
}: {
  demandesEnAttente: number;
}) {
  const t = useTranslations("admin.onglets");
  const chemin = usePathname();
  return (
    <nav className="-mx-4 [scrollbar-width:none] overflow-x-auto px-4">
      <ul className="flex gap-1 border-b">
        {ONGLETS.map(({ href, cle, icone: Icone }) => {
          const actif = chemin.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={actif ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 border-b-2 px-3 py-3 text-sm whitespace-nowrap transition-colors",
                  actif
                    ? "border-foreground font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <Icone className="size-4" />
                {t(cle)}
                {cle === "demandes" && demandesEnAttente > 0 && (
                  <span className="rounded-full bg-marque-2 px-1.5 text-xs font-bold text-white">
                    {demandesEnAttente}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
