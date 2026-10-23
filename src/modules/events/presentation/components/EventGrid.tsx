import { cn } from "@/shared/lib/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { EventView } from "@/modules/events/domain/event-view.types";
import {
  eventImage,
  eventImageLayout,
} from "@/modules/events/domain/event-image";
import { ProgressiveImage } from "@/shared/components/ProgressiveImage";

/**
 * Grille de vignettes (rayon 16) au format portrait 3:4 (comme la grille d'Instagram),
 * comme sur les réseaux sociaux : la photo n'est ni coupée ni déformée, elle
 * est centrée sur un fond noir qui comble l'espace restant.
 */
export function EventGrid({
  events,
  className,
}: {
  events: EventView[];
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "grid grid-cols-3 gap-1.5 sm:gap-2 lg:grid-cols-4 xl:grid-cols-5",
        className,
      )}
    >
      {events.map((e) => (
        <li key={e.id}>
          <Link
            href={`/e/${e.id}`}
            className="group relative block aspect-[3/4] overflow-hidden rounded-media bg-black outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <ProgressiveImage
              src={eventImage(e)}
              placeholder={eventImageLayout(e)?.placeholder}
              fill
              fit="contain"
              className="bg-black"
              imageClassName={cn(e.status === "cancelled" && "grayscale")}
            />
            <span className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent p-2 text-left text-xs font-semibold text-white">
              <span className="line-clamp-2">{e.name}</span>
            </span>
            <GridBadge event={e} className="absolute top-1.5 right-1.5" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * Badge encre opaque d'une vignette (Passé, En cours, Modifié, Annulé) ;
 * rien pour un événement publié à venir.
 */
export function GridBadge({
  event,
  className,
}: {
  event: EventView;
  className?: string;
}) {
  const t = useTranslations();
  if (event.status === "published" && event.period === "upcoming") return null;
  return (
    <span
      className={cn(
        "rounded-full bg-ct-ink px-2 py-0.5 text-[11px] font-semibold text-background",
        className,
      )}
    >
      {event.status === "published"
        ? t(`periods.${event.period}`)
        : t(`statuses.${event.status}`)}
    </span>
  );
}
