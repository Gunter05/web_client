"use client";

import { useLocale } from "next-intl";
import { useMonte } from "@/shared/hooks/use-monte";
import { cn } from "@/shared/lib/utils";

/**
 * Tuile « OCT / 05 » posée sur le coin de l'image, façon billet. Le jour
 * dépend du fuseau de l'appareil (D7) : rendue dans le navigateur.
 */
export function TuileDate({
  iso,
  className,
}: {
  iso: string;
  className?: string;
}) {
  const monte = useMonte();
  const langue = useLocale() === "fr" ? "fr-FR" : "en-US";
  const date = new Date(iso);
  const mois = new Intl.DateTimeFormat(langue, { month: "short" })
    .format(date)
    .replace(".", "")
    .toUpperCase();
  const jour = new Intl.DateTimeFormat(langue, { day: "2-digit" }).format(date);
  return (
    <time
      dateTime={iso}
      aria-hidden
      className={cn(
        "grid w-14 overflow-hidden rounded-lg border bg-card text-center leading-none",
        className,
      )}
    >
      <span className="bg-danger py-1 text-[11px] font-bold tracking-wider text-white">
        {monte ? mois : " "}
      </span>
      <span className="py-1.5 text-2xl font-bold tabular-nums">
        {monte ? jour : " "}
      </span>
    </time>
  );
}
