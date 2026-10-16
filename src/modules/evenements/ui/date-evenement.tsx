"use client";

import { formaterDateEvenement } from "@/shared/i18n/dates";
import { useMonte } from "@/shared/hooks/use-monte";
import { useLocale, useTranslations } from "next-intl";

/**
 * Date au format US-16 dans l'heure locale de l'appareil (D7). Rendue
 * uniquement dans le navigateur, seul à connaître le fuseau de l'appareil.
 */
export function DateEvenement({
  iso,
  className,
}: {
  iso: string;
  className?: string;
}) {
  const monte = useMonte();
  const langue = useLocale();
  const t = useTranslations("dates");
  return (
    <time dateTime={iso} className={className}>
      {monte
        ? formaterDateEvenement(iso, langue, {
            aujourdhui: (heure) => t("aujourdhui", { heure }),
            demain: (heure) => t("demain", { heure }),
          })
        : " "}
    </time>
  );
}
