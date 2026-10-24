"use client";

import { useLocale } from "next-intl";
import { useMounted } from "@/shared/hooks/useMounted";
import { formatTime } from "@/shared/i18n/dates";

/**
 * Heure seule (« 19h17 »), à côté de la tuile qui donne déjà le jour. Rendue
 * dans le navigateur, seul à connaître le fuseau de l'appareil (D7).
 */
export function EventTime({
  iso,
  className,
}: {
  iso: string;
  className?: string;
}) {
  const mounted = useMounted();
  const locale = useLocale();
  return (
    <time dateTime={iso} className={className}>
      {mounted ? formatTime(new Date(iso), locale) : " "}
    </time>
  );
}
