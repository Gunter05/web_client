"use client";

import { cn } from "@/shared/lib/utils";
import { CalendarDaysIcon, FlagIcon, InboxIcon, UsersIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/page-requests", key: "pageRequests", icon: InboxIcon },
  { href: "/admin/accounts", key: "accounts", icon: UsersIcon },
  { href: "/admin/pages", key: "pages", icon: FlagIcon },
  { href: "/admin/events", key: "events", icon: CalendarDaysIcon },
] as const;

/** Les quatre onglets de l'espace Administration (US-07). */
export function AdminTabs({
  pendingPageRequests,
}: {
  pendingPageRequests: number;
}) {
  const t = useTranslations("admin.tabs");
  const path = usePathname();
  return (
    <nav className="-mx-4 [scrollbar-width:none] overflow-x-auto px-4">
      <ul className="flex gap-1 border-b">
        {TABS.map(({ href, key, icon: Icon }) => {
          const active = path.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 border-b-2 px-3 py-3 text-sm whitespace-nowrap transition-colors",
                  active
                    ? "border-foreground font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {t(key)}
                {key === "pageRequests" && pendingPageRequests > 0 && (
                  <span className="rounded-full bg-marque-2 px-1.5 text-xs font-bold text-white">
                    {pendingPageRequests}
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
