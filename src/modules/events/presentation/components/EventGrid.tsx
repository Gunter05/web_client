import { cn } from "@/shared/lib/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { EventView } from "@/modules/events/domain/event-view.types";
import { DEFAULT_IMAGE } from "@/modules/events/presentation/components/EventCard";

/** Grille de vignettes carrées, comme la grille d'un profil Instagram. */
export function EventGrid({
  events,
  className,
}: {
  events: EventView[];
  className?: string;
}) {
  const t = useTranslations();
  return (
    <ul className={cn("grid grid-cols-3 gap-0.5 sm:gap-1", className)}>
      {events.map((e) => (
        <li key={e.id}>
          <Link
            href={`/e/${e.id}`}
            className="group relative block aspect-square overflow-hidden bg-muted"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- images simulées (SVG) */}
            <img
              src={e.photoUrl ?? DEFAULT_IMAGE}
              alt=""
              loading="lazy"
              className={cn(
                "size-full object-cover",
                e.status === "cancelled" && "grayscale",
              )}
            />
            <span className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent p-2 text-left text-xs font-semibold text-white">
              <span className="line-clamp-2">{e.name}</span>
            </span>
            {(e.status !== "published" || e.period !== "upcoming") && (
              <span className="absolute top-1.5 right-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                {e.status === "published"
                  ? t(`periods.${e.period}`)
                  : t(`statuses.${e.status}`)}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
