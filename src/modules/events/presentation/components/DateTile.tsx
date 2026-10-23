"use client";

import { useLocale } from "next-intl";
import { useMounted } from "@/shared/hooks/useMounted";
import { cn } from "@/shared/lib/utils";

/**
 * Tuile « OCT / 05 » façon billet, toujours opaque, y compris posée sur une
 * image (`onImage` : ombre portée). Le jour dépend du fuseau de l'appareil
 * (D7) : rendue dans le navigateur.
 */
export function DateTile({
  iso,
  onImage = false,
  className,
}: {
  iso: string;
  onImage?: boolean;
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
        "grid w-14 overflow-hidden rounded-[14px] text-center leading-none",
        "ct-solid",
        onImage && "shadow-[0_4px_14px_rgb(0_0_0/0.22)]",
        className,
      )}
    >
      <span className="bg-ct-red py-1 text-[11px] font-bold tracking-wider text-white">
        {mounted ? month : " "}
      </span>
      <span className="py-1.5 text-2xl font-bold tabular-nums">
        {mounted ? day : " "}
      </span>
    </time>
  );
}
