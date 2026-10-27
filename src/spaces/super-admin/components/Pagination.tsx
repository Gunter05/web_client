import { CaretLeftIcon, CaretRightIcon } from "@/shared/components/icons";
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
  const t = useTranslations("common");
  if (totalPages <= 1) return null;
  const link = (p: number) =>
    `?${new URLSearchParams({ ...(q ? { q } : {}), page: String(p) })}`;
  const button = (inactive: boolean) =>
    cn(
      buttonVariants({ variant: "outline", size: "sm" }),
      inactive && "pointer-events-none opacity-50",
    );
  return (
    <nav className="flex items-center justify-between gap-2 text-sm">
      <Link
        href={link(page - 1)}
        className={button(page <= 1)}
        aria-disabled={page <= 1}
      >
        <CaretLeftIcon /> {t("previous")}
      </Link>
      <span className="text-muted-foreground">
        {t("pageOf", { page, total: totalPages })}
      </span>
      <Link
        href={link(page + 1)}
        className={button(page >= totalPages)}
        aria-disabled={page >= totalPages}
      >
        {t("next")} <CaretRightIcon />
      </Link>
    </nav>
  );
}
