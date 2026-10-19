"use client";

import { useLocale } from "next-intl";
import { useMounted } from "@/shared/hooks/useMounted";
import { formatShortDate } from "@/shared/i18n/dates";

/** Date courte dans le fuseau de l'appareil (D7). */
export function ShortDate({ iso }: { iso: string }) {
  const mounted = useMounted();
  const locale = useLocale();
  return (
    <time dateTime={iso}>{mounted ? formatShortDate(iso, locale) : " "}</time>
  );
}
