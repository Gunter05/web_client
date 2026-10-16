"use client";

import { useLocale } from "next-intl";
import { useMonte } from "@/shared/hooks/use-monte";
import { formaterDateCourte } from "@/shared/i18n/dates";

/** Date courte dans le fuseau de l'appareil (D7). */
export function DateCourte({ iso }: { iso: string }) {
  const monte = useMonte();
  const langue = useLocale();
  return (
    <time dateTime={iso}>{monte ? formaterDateCourte(iso, langue) : " "}</time>
  );
}
