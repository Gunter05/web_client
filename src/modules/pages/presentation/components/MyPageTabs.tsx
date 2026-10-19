import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/shared/lib/utils";
import type { Role } from "@/modules/pages/domain/page.types";

/**
 * Onglets d'une page dans « Mes pages » : ses événements (avec les vues,
 * US-39) et, pour le propriétaire seulement, la gestion des accès (US-06).
 */
export function MyPageTabs({
  slug,
  role,
  active,
}: {
  slug: string;
  role: Role;
  active: "events" | "access";
}) {
  const t = useTranslations("pages.myPages");
  const tabs: { key: "events" | "access"; href: string }[] = [
    { key: "events", href: `/my-pages/${slug}` },
    ...(role === "owner"
      ? [{ key: "access" as const, href: `/my-pages/${slug}/access` }]
      : []),
  ];
  return (
    <nav className="flex gap-6 border-b" aria-label={t("title")}>
      {tabs.map((o) => (
        <Link
          key={o.key}
          href={o.href}
          aria-current={o.key === active ? "page" : undefined}
          className={cn(
            "-mb-px border-b-2 border-transparent pb-2 text-sm font-semibold text-muted-foreground",
            o.key === active && "border-foreground text-foreground",
          )}
        >
          {t(o.key)}
        </Link>
      ))}
    </nav>
  );
}
