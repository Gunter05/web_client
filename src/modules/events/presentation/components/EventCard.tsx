import { useTranslations } from "next-intl";
import Link from "next/link";
import type React from "react";
import {
  eventImage,
  eventImageLayout,
  feedImageRatio,
} from "@/modules/events/domain/event-image";
import type { EventView } from "@/modules/events/domain/event-view.types";
import { EventBadges } from "@/modules/events/presentation/components/EventBadges";
import { DateTile } from "@/modules/events/presentation/components/DateTile";
import { EventTime } from "@/modules/events/presentation/components/EventTime";
import { PublicationDate } from "@/modules/events/presentation/components/PublicationDate";
import { ProfileAvatar } from "@/shared/components/ProfileAvatar";
import { ProgressiveImage } from "@/shared/components/ProgressiveImage";
import { cn } from "@/shared/lib/utils";

export const DEFAULT_IMAGE = "/demo/defaut.svg";

/**
 * Carte d'événement du fil (US-01), sobre : qui publie et quand, l'affiche
 * avec la tuile de date posée sur son coin (la signature du site), puis le
 * strict nécessaire à côté de la tuile : le nom sur une ligne, puis le
 * statut, l'heure et le lieu. Catégories, description et Partager sont dans
 * la fiche.
 *
 * L'affiche garde ses proportions entre 4:5 et 1,91:1 et ne dépasse jamais
 * 70 % de la hauteur de l'écran : une affiche très haute est recadrée au
 * centre ; la fiche complète la montre en entier.
 */
export function EventCard({
  event,
  priority = false,
  onOpen,
}: {
  event: EventView;
  priority?: boolean;
  /**
   * Ouvre l'aperçu au lieu de naviguer, sur grand écran seulement. Le lien
   * vers /e/{id} reste en place : nouvel onglet (Ctrl/Cmd + clic, clic
   * molette) et, sur mobile, vraie page avec retour natif.
   */
  onOpen?: (eventId: string) => void;
}) {
  const t = useTranslations();
  const cancelled = event.status === "cancelled";
  const layout = eventImageLayout(event);
  const open = onOpen
    ? (e: React.MouseEvent) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        // Sur mobile, le lien ouvre la vraie page : le retour du téléphone y ramène au fil
        if (opensAsPage()) return;
        e.preventDefault();
        onOpen(event.id);
      }
    : undefined;
  return (
    <article className="grid min-w-0 grid-cols-1 gap-2.5 border-b pb-6 sm:border-none sm:pb-0">
      <header className="flex items-center gap-2.5 px-4 sm:px-0">
        <Link
          href={`/p/${event.organizer.slug}`}
          className="flex min-w-0 items-center gap-2.5"
        >
          <ProfileAvatar
            name={event.organizer.name}
            photo={event.organizer.photoUrl}
            size="sm"
          />
          <span className="truncate text-sm font-semibold">
            {event.organizer.name}
          </span>
        </Link>
        <span aria-hidden className="text-muted-foreground">
          ·
        </span>
        <PublicationDate
          iso={event.createdAt}
          className="truncate text-sm text-muted-foreground"
        />
      </header>

      <Link
        href={`/e/${event.id}`}
        onClick={open}
        className="block sm:overflow-hidden sm:rounded-lg"
        // Le nom accessible doit contenir le texte visible (WCAG 2.5.3) :
        // « Annulé » est écrit sur la photo d'un événement annulé.
        aria-label={
          cancelled ? `${t("statuses.cancelled")} : ${event.name}` : event.name
        }
      >
        <div
          className="relative max-h-[70svh] w-full bg-muted"
          style={{ aspectRatio: feedImageRatio(layout) }}
        >
          <ProgressiveImage
            src={eventImage(event)}
            fill
            placeholder={layout?.placeholder}
            priority={priority}
            imageClassName={cn(cancelled && "opacity-60 grayscale")}
          />
          {cancelled && (
            <span className="absolute inset-0 grid place-items-center">
              <span className="rounded-md bg-destructive px-3 py-1 text-sm font-semibold tracking-wide text-white uppercase">
                {t("statuses.cancelled")}
              </span>
            </span>
          )}
        </div>
      </Link>

      {/* Tuile posée sur le coin de l'affiche, étirée jusqu'au bas du texte voisin */}
      <div className="flex items-stretch gap-3 px-4 sm:px-0">
        <DateTile
          iso={event.startsAt}
          className={cn(
            "relative -mt-9 shrink-0 self-stretch",
            cancelled && "opacity-70 grayscale",
          )}
        />
        <div className="grid min-w-0 flex-1">
          <h2
            className={cn(
              "truncate text-base leading-snug font-semibold",
              cancelled && "text-muted-foreground line-through",
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
          {/* Le statut d'abord : c'est ici que l'on décide si l'on peut venir */}
          <p className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
            <EventBadges
              status={event.status}
              period={event.period}
              compact
              className="shrink-0 flex-nowrap empty:hidden"
            />
            <EventTime iso={event.startsAt} className="shrink-0" />
            <span aria-hidden>·</span>
            <span className="truncate">{event.location}</span>
          </p>
        </div>
      </div>
    </article>
  );
}

/**
 * Écran étroit (sous `sm`, 640 px), où l'aperçu prendrait tout l'écran : la
 * fiche s'ouvre alors comme une page, pour que le bouton retour du téléphone
 * et le geste de retour fonctionnent comme partout ailleurs.
 */
export const PAGE_QUERY = "(max-width: 639.98px)";

function opensAsPage(): boolean {
  return (
    typeof window !== "undefined" && !!window.matchMedia?.(PAGE_QUERY).matches
  );
}

/** Dimensions et aperçu flou à passer à l'image, quand ils sont connus. */
export function layoutProps(event: EventView) {
  const layout = eventImageLayout(event);
  return layout
    ? {
        width: layout.width,
        height: layout.height,
        placeholder: layout.placeholder,
      }
    : {};
}
