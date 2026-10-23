import { MapPinIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { ProgressiveImage } from "@/shared/components/ProgressiveImage";
import { eventImage } from "@/modules/events/domain/event-image";
import type { EventView } from "@/modules/events/domain/event-view.types";
import { CategoryChips } from "@/modules/events/presentation/components/CategoryChips";
import { DateTile } from "@/modules/events/presentation/components/DateTile";
import { EventDate } from "@/modules/events/presentation/components/EventDate";

/**
 * Grande carte opaque du prochain événement d'une page : photo de 196 px avec
 * la pastille de catégorie et la tuile de date, puis titre, jour et heure,
 * lieu. Toute la carte mène à la fiche.
 */
export function NextEventCard({
  event,
  className,
}: {
  event: EventView;
  className?: string;
}) {
  return (
    <Link
      href={`/e/${event.id}`}
      className={cn(
        "group grid gap-3 rounded-card bg-card p-3 text-card-foreground shadow-card outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <div className="relative h-[196px] overflow-hidden rounded-media">
        <ProgressiveImage
          src={eventImage(event)}
          fill
          imageClassName="transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <CategoryChips
          categories={event.categories}
          className="pointer-events-none absolute inset-x-2.5 top-2.5"
        />
        <DateTile
          iso={event.startsAt}
          onImage
          className="pointer-events-none absolute bottom-2.5 left-2.5"
        />
      </div>
      <div className="grid gap-1 px-1 pb-1">
        <h3 className="text-xl leading-snug font-bold group-hover:underline">
          {event.name}
        </h3>
        <EventDate
          iso={event.startsAt}
          className="text-sm first-letter:uppercase"
        />
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPinIcon className="size-4 shrink-0" />
          <span className="truncate">{event.location}</span>
        </p>
      </div>
    </Link>
  );
}
