"use client";

import { useLocale } from "next-intl";
import { useMounted } from "@/shared/hooks/useMounted";
import { cn } from "@/shared/lib/utils";

/**
 * Tuile « OCT / 05 » posée sur le coin de l'image, façon billet. Le jour
 * dépend du fuseau de l'appareil (D7) : rendue dans le navigateur.
 */
export function DateTile({
  iso,
  className,
}: {
  iso: string;
  className?: string;
}) {
  const mounted = useMounted();
  const locale = useLocale() === "fr" ? "fr-FR" : "en-US";
  const date = new Date(iso);
  const month = new Intl.DateTimeFormat(locale, { month: "short" })
    .format(date)
    .replace(".", "")
    .toUpperCase();
  const day = new Intl.DateTimeFormat(locale, { day: "2-digit" }).format(date);
  return (
    <time
      dateTime={iso}
      aria-hidden
      className={cn(
        "grid w-14 overflow-hidden rounded-lg border bg-card text-center leading-none",
        className,
      )}
    >
      <span className="bg-primary py-1 text-[11px] font-bold tracking-wider text-primary-foreground">
        {mounted ? month : " "}
      </span>
      <span className="py-1.5 text-2xl font-bold tabular-nums">
        {mounted ? day : " "}
      </span>
    </time>
  );
}
