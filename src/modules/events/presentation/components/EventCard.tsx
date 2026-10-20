import { eventImage } from "@/modules/events/domain/event-image";
import { ProfileAvatar } from "@/shared/components/ProfileAvatar";
import { cn } from "@/shared/lib/utils";
import { MapPinIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type React from "react";
import type { EventView } from "@/modules/events/domain/event-view.types";
import { EventBadges } from "@/modules/events/presentation/components/EventBadges";
import { ShareIconButton } from "@/modules/events/presentation/components/ShareButton";
import { EventDate } from "@/modules/events/presentation/components/EventDate";
import { PublicationDate } from "@/modules/events/presentation/components/PublicationDate";
import { DateTile } from "@/modules/events/presentation/components/DateTile";

export const DEFAULT_IMAGE = "/demo/defaut.svg";

/**
 * Carte d'événement façon publication Instagram (US-01) : en-tête avec la
 * page et la date de publication, grande image, tuile de date posée sur son
 * coin, puis nom, date et heure, lieu, catégories et badges de statut.
 */
export function EventCard({
  event,
  priority = false,
  onShare,
  onOpen,
}: {
  event: EventView;
  priority?: boolean;
  /**
   * Ouvre l'aperçu au lieu de naviguer. Le lien vers /e/{id} reste en place
   * pour l'ouverture dans un nouvel onglet (Ctrl/Cmd + clic, clic molette).
   */
  onOpen?: (eventId: string) => void;
  /** Mesure du clic sur « Partager », fournie par la route (métrique Viralité). */
  onShare?: (eventId: string) => Promise<void>;
}) {
  const t = useTranslations();
  const annule = event.status === "cancelled";
  const open = onOpen
    ? (e: React.MouseEvent) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        onOpen(event.id);
      }
    : undefined;
  return (
    <article className="overflow-hidden border-b pb-4 sm:rounded-xl sm:border-none">
      <header className="flex items-center gap-3 px-3 py-2.5 sm:px-0">
        <Link
          href={`/p/${event.organizer.slug}`}
          className="flex min-w-0 items-center gap-2.5"
        >
          <ProfileAvatar
            name={event.organizer.name}
            photo={event.organizer.photoUrl}
            size="md"
          />
          <span className="grid min-w-0">
            <span className="truncate text-sm font-semibold">
              {event.organizer.name}
            </span>
            <PublicationDate
              iso={event.createdAt}
              className="text-xs text-muted-foreground"
            />
          </span>
        </Link>
        <EventBadges
          status={event.status}
          period={event.period}
          className="ml-auto justify-end"
        />
      </header>
      <Link
        href={`/e/${event.id}`}
        onClick={open}
        className="group block"
        aria-label={event.name}
      >
        <div className="relative overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element -- images simulées (SVG) */}
          <img
            src={eventImage(event)}
            alt=""
            loading={priority ? "eager" : "lazy"}
            className={cn(
              // Largeur du fil, hauteur libre : la photo garde ses proportions.
              "block h-auto w-full rounded-sm transition-transform duration-500 group-hover:scale-[1.02]",
              annule && "grayscale",
            )}
          />
          {annule && (
            <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 -rotate-6 bg-destructive py-2 text-center text-lg font-bold tracking-widest text-white uppercase">
              {t("statuses.cancelled")}
            </span>
          )}
        </div>
      </Link>

      {/* Tuile de date posée sur l'image, actions à droite (comme Instagram). */}
      <div className="flex items-start justify-between px-3 sm:px-0">
        <DateTile iso={event.startsAt} className="relative -mt-7 shrink-0" />
        <ShareIconButton
          path={`/e/${event.id}`}
          title={event.name}
          text={event.name}
          onShare={onShare ? () => onShare(event.id) : undefined}
          className="mt-1 -mr-2"
        />
      </div>

      <div className="grid gap-1 px-3 pt-2 sm:px-0">
        <h2
          className={cn(
            "text-xl leading-snug font-semibold",
            annule && "text-muted-foreground line-through",
          )}
        >
          <Link
            href={`/e/${event.id}`}
            onClick={open}
            className="hover:underline"
          >
            {event.name}
          </Link>
        </h2>
        <EventDate
          iso={event.startsAt}
          className="text-sm first-letter:uppercase"
        />
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPinIcon className="size-4 shrink-0" />
          <span className="truncate">{event.location}</span>
        </p>
        <p className="flex flex-wrap gap-x-2 text-sm text-foreground">
          {event.categories.map((c) => (
            <span key={c}>#{t(`categories.${c}`).replaceAll(" ", "")}</span>
          ))}
        </p>
      </div>
    </article>
  );
}
