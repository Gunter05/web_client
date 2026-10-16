import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";

/** Pagination par 25 (US-07). */
export function Pagination({
  page,
  totalPages,
  q,
}: {
  page: number;
  totalPages: number;
  q: string;
}) {
  const t = useTranslations("commun");
  if (totalPages <= 1) return null;
  const lien = (p: number) =>
    `?${new URLSearchParams({ ...(q ? { q } : {}), page: String(p) })}`;
  const bouton = (inactif: boolean) =>
    cn(
      buttonVariants({ variant: "outline", size: "sm" }),
      inactif && "pointer-events-none opacity-50",
    );
  return (
    <nav className="flex items-center justify-between gap-2 text-sm">
      <Link
        href={lien(page - 1)}
        className={bouton(page <= 1)}
        aria-disabled={page <= 1}
      >
        <ChevronLeftIcon /> {t("precedent")}
      </Link>
      <span className="text-muted-foreground">
        {t("pageSur", { page, total: totalPages })}
      </span>
      <Link
        href={lien(page + 1)}
        className={bouton(page >= totalPages)}
        aria-disabled={page >= totalPages}
      >
        {t("suivant")} <ChevronRightIcon />
      </Link>
    </nav>
  );
}
