"use client";

import { useFormatter } from "next-intl";
import { useMonte } from "@/shared/hooks/useMonte";

/** Date de publication relative (« il y a 2 jours »), sous le nom de la page. */
export function DatePublication({
  iso,
  className,
}: {
  iso: string;
  className?: string;
}) {
  const monte = useMonte();
  const format = useFormatter();
  return (
    <time dateTime={iso} className={className}>
      {monte ? format.relativeTime(new Date(iso), new Date()) : " "}
    </time>
  );
}
