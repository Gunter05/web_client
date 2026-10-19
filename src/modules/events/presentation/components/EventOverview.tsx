"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import type { ReactNode } from "react";
import { ProfileAvatar } from "@/shared/components/ProfileAvatar";
import { cn } from "@/shared/lib/utils";
import { eventImage } from "@/modules/events/domain/event-image";
import type { EventView } from "@/modules/events/domain/event-view.types";
import { EventBadges } from "@/modules/events/presentation/components/EventBadges";
import {
  EventAboutAndPlace,
  EventCancellation,
  EventPresenter,
  EventWhenWhere,
} from "@/modules/events/presentation/components/EventInfo";

type TitleProps = { className: string; children: ReactNode };

/**
 * Présentation d'un événement, identique dans l'aperçu (panneau) et sur la
 * fiche (/e/{id}) : photo pleine largeur, nom, organisateur, statut, date et
 * lieu, puis « À propos », « Lieu » et « Présenté par ».
 */
export function EventOverview({
  event,
  title = (props) => <h1 {...props} />,
  children,
}: {
  event: EventView;
  /** Élément du titre (le panneau utilise le titre de sa boîte de dialogue). */
  title?: (props: TitleProps) => ReactNode;
  /** Blocs propres à la fiche (dernière modification, vues), sous la date. */
  children?: ReactNode;
}) {
  const t = useTranslations();
  const cancelled = event.status === "cancelled";

  return (
    <article className="grid gap-6 px-6 pt-8 pb-10">
      {/* eslint-disable-next-line @next/next/no-img-element -- images simulées (SVG) */}
      <img
        src={eventImage(event)}
        alt=""
        className={cn(
          // Toute la largeur, hauteur libre : la photo garde ses proportions.
          "h-auto w-full rounded-xl",
          cancelled && "grayscale",
        )}
      />

      <div className="grid gap-2">
        {title({
          className: cn(
            "text-2xl leading-tight font-bold",
            cancelled && "text-muted-foreground line-through",
          ),
          children: event.name,
        })}
        <Link
          href={`/p/${event.organizer.slug}`}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ProfileAvatar
            name={event.organizer.name}
            photo={event.organizer.photoUrl}
            size="xs"
          />
          {t("events.sheet.organizedBy", { name: event.organizer.name })}
        </Link>
        <EventBadges status={event.status} period={event.period} />
      </div>

      <EventWhenWhere event={event} />
      <EventCancellation event={event} />
      {children}
      <EventAboutAndPlace event={event} />
      <EventPresenter event={event} />
    </article>
  );
}
