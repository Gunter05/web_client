import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { ProgressiveImage } from "@/shared/components/ProgressiveImage";
import { eventImage } from "@/modules/events/domain/event-image";
import type { EventView } from "@/modules/events/domain/event-view.types";
import { EventDate } from "@/modules/events/presentation/components/EventDate";
import { GridBadge } from "@/modules/events/presentation/components/EventGrid";

/**
 * Cartes opaques compactes des événements d'une page : photo de 140 px,
 * titre, date. Deux colonnes sur téléphone, trois sur ordinateur.
 */
export function EventTiles({
  events,
  className,
}: {
  events: EventView[];
  className?: string;
}) {
  return (
    <ul className={cn("grid grid-cols-2 gap-3 md:grid-cols-3", className)}>
      {events.map((e) => (
        <li key={e.id}>
          <Link
            href={`/e/${e.id}`}
            className="group grid h-full content-start gap-2 rounded-card bg-card p-2 text-card-foreground shadow-card outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <div className="relative h-[140px] overflow-hidden rounded-media">
              <ProgressiveImage
                src={eventImage(e)}
                fill
                imageClassName={cn(e.status === "cancelled" && "grayscale")}
              />
              <GridBadge event={e} className="absolute top-2 right-2" />
            </div>
            <div className="grid gap-0.5 px-1 pb-1">
              <h3
                className={cn(
                  "line-clamp-2 text-sm leading-snug font-semibold group-hover:underline",
                  e.status === "cancelled" &&
                    "text-muted-foreground line-through",
                )}
              >
                {e.name}
              </h3>
              <EventDate
                iso={e.startsAt}
                className="text-xs text-muted-foreground first-letter:uppercase"
              />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
