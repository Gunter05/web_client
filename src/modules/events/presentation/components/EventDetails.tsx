import { ProfileAvatar } from "@/shared/components/ProfileAvatar";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";
import {
  AlertTriangleIcon,
  BanIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { ReactNode } from "react";
import type { EventView } from "@/modules/events/domain/event-view.types";
import type { TrackedChange } from "@/modules/events/domain/event";
import { EventBadges } from "@/modules/events/presentation/components/EventBadges";
import { DEFAULT_IMAGE } from "@/modules/events/presentation/components/EventCard";
import { EventDate } from "@/modules/events/presentation/components/EventDate";

/**
 * Fiche d'un événement (US-01), accessible sans compte. Les actions (partager,
 * modifier, annuler) et le compteur de vues sont fournis par la page appelante
 * selon les droits de la personne (membre ou non de la page organisatrice).
 */
export function EventDetails({
  event,
  actions,
  views,
}: {
  event: EventView;
  actions: ReactNode;
  views?: ReactNode;
}) {
  const t = useTranslations();
  const annule = event.status === "cancelled";
  return (
    <article className="grid overflow-hidden bg-card sm:rounded-xl sm:border md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <div className="relative aspect-square bg-muted md:aspect-auto md:min-h-full">
        {/* eslint-disable-next-line @next/next/no-img-element -- images simulées (SVG) */}
        <img
          src={event.photoUrl ?? DEFAULT_IMAGE}
          alt=""
          className={cn(
            "size-full object-cover md:absolute md:inset-0",
            annule && "grayscale",
          )}
        />
      </div>

      <div className="flex min-w-0 flex-col">
        <header className="flex items-center gap-3 border-b px-4 py-3">
          <Link
            href={`/p/${event.organizer.slug}`}
            className="flex min-w-0 items-center gap-2.5"
          >
            <ProfileAvatar
              name={event.organizer.name}
              photo={event.organizer.photoUrl}
              size="sm"
              ring
            />
            <span className="truncate text-sm font-semibold">
              {event.organizer.name}
            </span>
          </Link>
          <EventBadges
            status={event.status}
            period={event.period}
            className="ml-auto justify-end"
          />
        </header>

        <div className="grid gap-5 p-4">
          {annule && event.cancellation && (
            <div
              role="status"
              className="flex gap-3 rounded-lg border border-destructive/40 bg-danger-fond p-3 text-sm"
            >
              <BanIcon className="mt-0.5 size-4 shrink-0 text-danger" />
              <div className="grid gap-1">
                <p className="font-semibold text-danger">
                  {t("statuses.cancelled")} ·{" "}
                  <EventDate iso={event.cancellation.at} />
                </p>
                <p>
                  <span className="text-muted-foreground">
                    {t("events.reason")}{" "}
                  </span>
                  {event.cancellation.reason}
                </p>
              </div>
            </div>
          )}

          <h1
            className={cn(
              "text-2xl leading-tight font-bold",
              annule && "text-muted-foreground line-through",
            )}
          >
            {event.name}
          </h1>

          <dl className="grid gap-3 text-sm">
            <Info
              icon={<CalendarIcon />}
              label={event.endsAt ? t("events.from") : t("events.startsAt")}
            >
              <EventDate
                iso={event.startsAt}
                className="font-medium first-letter:uppercase"
              />
            </Info>
            {event.endsAt && (
              <Info icon={<ClockIcon />} label={t("events.to")}>
                <EventDate
                  iso={event.endsAt}
                  className="font-medium first-letter:uppercase"
                />
              </Info>
            )}
            <Info icon={<MapPinIcon />} label={t("events.location")}>
              <span className="font-medium">{event.location}</span>
            </Info>
          </dl>

          <div className="flex flex-wrap gap-1.5">
            {event.categories.map((c) => (
              <Badge key={c} variant="secondary">
                {t(`categories.${c}`)}
              </Badge>
            ))}
          </div>

          {event.description && (
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          )}

          {event.status === "updated" && event.latestUpdate && (
            <LatestUpdate
              at={event.latestUpdate.at}
              changes={event.latestUpdate.changes}
            />
          )}

          {views}
        </div>

        <footer className="mt-auto flex flex-wrap gap-2 border-t p-4">
          {actions}
        </footer>
      </div>
    </article>
  );
}

function Info({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-muted-foreground [&_svg]:size-4">
        {icon}
      </span>
      <div className="grid">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd>{children}</dd>
      </div>
    </div>
  );
}

/** Ancienne et nouvelle valeur de chaque champ changé lors de la dernière modification (US-15). */
function LatestUpdate({
  at,
  changes,
}: {
  at: string;
  changes: TrackedChange[];
}) {
  const t = useTranslations("events");
  const value = (c: TrackedChange, v: string | null) =>
    v === null ? (
      t("noEnd")
    ) : c.field === "location" ? (
      v
    ) : (
      <EventDate iso={v} className="first-letter:uppercase" />
    );
  return (
    <section className="grid gap-2 rounded-lg border border-avertissement/40 bg-avertissement-fond p-3 text-sm">
      <p className="flex items-center gap-2 font-semibold text-avertissement">
        <AlertTriangleIcon className="size-4" />
        <span>
          {t("latestUpdate")} <EventDate iso={at} />
        </span>
      </p>
      <table className="w-full text-left">
        <thead className="text-xs text-muted-foreground">
          <tr>
            <th className="py-1 pr-2 font-normal" />
            <th className="py-1 pr-2 font-normal">{t("before")}</th>
            <th className="py-1 font-normal">{t("after")}</th>
          </tr>
        </thead>
        <tbody>
          {changes.map((c) => (
            <tr key={c.field} className="align-top">
              <th className="py-1 pr-2 font-medium">
                {t(`changedFields.${c.field}`)}
              </th>
              <td className="py-1 pr-2 text-muted-foreground line-through">
                {value(c, c.before)}
              </td>
              <td className="py-1 font-medium">{value(c, c.after)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
