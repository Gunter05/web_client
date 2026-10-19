"use client";

import { useFormatter } from "next-intl";
import { useMounted } from "@/shared/hooks/useMounted";

/** Date de publication relative (« il y a 2 jours »), sous le nom de la page. */
export function PublicationDate({
  iso,
  className,
}: {
  iso: string;
  className?: string;
}) {
  const mounted = useMounted();
  const format = useFormatter();
  return (
    <time dateTime={iso} className={className}>
      {mounted ? format.relativeTime(new Date(iso), new Date()) : " "}
    </time>
  );
}
