import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/shared/lib/utils";
import type { Role } from "@/features/pages/types/page.types";

/**
 * Onglets d'une page dans « Mes pages » : ses événements (avec les vues,
 * US-39) et, pour le propriétaire seulement, la gestion des accès (US-06).
 */
export function OngletsMaPage({
  slug,
  role,
  actif,
}: {
  slug: string;
  role: Role;
  actif: "evenements" | "acces";
}) {
  const t = useTranslations("pages.mesPages");
  const onglets: { cle: "evenements" | "acces"; href: string }[] = [
    { cle: "evenements", href: `/my-pages/${slug}` },
    ...(role === "proprietaire"
      ? [{ cle: "acces" as const, href: `/my-pages/${slug}/access` }]
      : []),
  ];
  return (
    <nav className="flex gap-6 border-b" aria-label={t("titre")}>
      {onglets.map((o) => (
        <Link
          key={o.cle}
          href={o.href}
          aria-current={o.cle === actif ? "page" : undefined}
          className={cn(
            "-mb-px border-b-2 border-transparent pb-2 text-sm font-semibold text-muted-foreground",
            o.cle === actif && "border-foreground text-foreground",
          )}
        >
          {t(o.cle)}
        </Link>
      ))}
    </nav>
  );
}
