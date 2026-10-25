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
 * Grille de vignettes au format portrait 3:4 (comme la grille d'Instagram),
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
  const t = useTranslations();
  return (
    <ul
      className={cn(
        "grid grid-cols-3 gap-0.5 sm:gap-1 lg:grid-cols-4 xl:grid-cols-5",
        className,
      )}
    >
      {events.map((e) => (
        <li key={e.id}>
          <Link
            href={`/e/${e.id}`}
            className="group relative block aspect-[3/4] overflow-hidden bg-black"
          >
            <ProgressiveImage
              src={eventImage(e)}
              fallbackSrc={eventImage({ ...e, photoUrl: null })}
              placeholder={eventImageLayout(e)?.placeholder}
              fill
              fit="contain"
              className="bg-black"
              imageClassName={cn(e.status === "cancelled" && "grayscale")}
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
