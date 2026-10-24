"use client";

import {
  ArrowSquareOutIcon,
  CaretRightIcon,
  MapPinIcon,
  ProhibitIcon,
} from "@/shared/components/icons";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import type { ReactNode } from "react";
import { ProfileAvatar } from "@/shared/components/ProfileAvatar";
import { useMounted } from "@/shared/hooks/useMounted";
import { Badge } from "@/shared/ui/badge";
import { buttonVariants } from "@/shared/ui/button";
import type { EventView } from "@/modules/events/domain/event-view.types";
import { DateTile } from "@/modules/events/presentation/components/DateTile";

/**
 * Blocs d'information d'un événement, communs à l'aperçu (panneau) et à la
 * fiche (/e/{id}). Les dates sont affichées à l'heure de l'appareil, donc
 * seulement une fois dans le navigateur (D7).
 */

/** Date (tuile + jour + horaire) et lieu, l'un sous l'autre. */
export function EventWhenWhere({ event }: { event: EventView }) {
  const format = useFormatter();
  const locale = useLocale();
  const mounted = useMounted();
  const start = new Date(event.startsAt);
  const time = (d: Date) =>
    format.dateTime(d, { hour: "2-digit", minute: "2-digit" });
  // Décalage horaire de l'appareil (« UTC+2 »), comme l'heure affichée.
  const zone = new Intl.DateTimeFormat(locale, { timeZoneName: "shortOffset" })
    .formatToParts(start)
    .find((p) => p.type === "timeZoneName")?.value;

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-4">
        <DateTile iso={event.startsAt} className="w-11 shrink-0 text-xs" />
        <div className="grid">
          <span className="font-medium first-letter:uppercase">
            {mounted
              ? format.dateTime(start, {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })
              : " "}
          </span>
          <span className="text-sm text-muted-foreground">
            {mounted
              ? `${time(start)}${event.endsAt ? ` - ${time(new Date(event.endsAt))}` : ""} ${zone ?? ""}`
              : " "}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-lg border">
          <MapPinIcon className="size-5 text-muted-foreground" />
        </span>
        <span className="font-medium">{event.location}</span>
      </div>
    </div>
  );
}

/** Encadré d'annulation, avec le motif. */
export function EventCancellation({ event }: { event: EventView }) {
  const t = useTranslations();
  if (event.status !== "cancelled" || !event.cancellation) return null;
  return (
    <div role="status" className="grid gap-1 overflow-hidden rounded-xl border">
      <p className="bg-muted px-4 py-2 text-sm text-muted-foreground">
        {t("statuses.cancelled")}
      </p>
      <p className="flex items-start gap-2 px-4 pt-2 pb-4 text-sm">
        <ProhibitIcon className="mt-0.5 size-4 shrink-0" />
        <span>
          <span className="text-muted-foreground">{t("events.reason")} </span>
          {event.cancellation.reason}
        </span>
      </p>
    </div>
  );
}

/** « À propos » (description, catégories) et « Lieu » (avec lien Maps). */
export function EventAboutAndPlace({
  event,
  showCategories = true,
}: {
  event: EventView;
  /** La fiche affiche les catégories ailleurs (colonne de gauche). */
  showCategories?: boolean;
}) {
  const t = useTranslations();
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;
  return (
    <>
      <InfoSection title={t("events.sheet.about")}>
        {event.description && (
          <p className="leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        )}
        {showCategories && (
          <div className="flex flex-wrap gap-1.5">
            {event.categories.map((c) => (
              <Badge key={c} variant="secondary">
                {t(`categories.${c}`)}
              </Badge>
            ))}
          </div>
        )}
      </InfoSection>

      <InfoSection title={t("events.location")}>
        <p>{event.location}</p>
        <a
          href={maps}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "justify-self-start",
          })}
        >
          {t("events.sheet.openMaps")} <ArrowSquareOutIcon />
        </a>
      </InfoSection>
    </>
  );
}

/** « Présenté par » : la page organisatrice, avec un lien vers elle. */
export function EventPresenter({ event }: { event: EventView }) {
  const t = useTranslations("events.sheet");
  return (
    <InfoSection title={t("presentedBy")}>
      <Link
        href={`/p/${event.organizer.slug}`}
        className="flex items-center gap-3 rounded-lg hover:bg-muted"
      >
        <ProfileAvatar
          name={event.organizer.name}
          photo={event.organizer.photoUrl}
          size="md"
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold">
            {event.organizer.name}
          </span>
          <span className="block truncate text-sm text-muted-foreground">
            @{event.organizer.slug}
          </span>
        </span>
        <CaretRightIcon className="size-5 text-muted-foreground" />
      </Link>
    </InfoSection>
  );
}

function InfoSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-3">
      <h3 className="border-b pb-2 text-sm font-medium text-muted-foreground">
        {title}
      </h3>
      {children}
    </section>
  );
}
