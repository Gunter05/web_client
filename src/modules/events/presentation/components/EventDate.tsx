"use client";

import { formatEventDate } from "@/shared/i18n/dates";
import { useMounted } from "@/shared/hooks/useMounted";
import { useLocale, useTranslations } from "next-intl";

/**
 * Date au format US-16 dans l'heure locale de l'appareil (D7). Rendue
 * uniquement dans le navigateur, seul à connaître le fuseau de l'appareil.
 */
export function EventDate({
  iso,
  className,
}: {
  iso: string;
  className?: string;
}) {
  const mounted = useMounted();
  const locale = useLocale();
  const t = useTranslations("dates");
  return (
    <time dateTime={iso} className={className}>
      {mounted
        ? formatEventDate(iso, locale, {
            today: (time) => t("today", { time }),
            tomorrow: (time) => t("tomorrow", { time }),
          })
        : " "}
    </time>
  );
}
