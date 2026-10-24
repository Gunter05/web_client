"use client";

import { AlertTriangleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { eventImage } from "@/modules/events/domain/event-image";
import { ProgressiveImage } from "@/shared/components/ProgressiveImage";
import { layoutProps } from "@/modules/events/presentation/components/EventCard";
import type { EventView } from "@/modules/events/domain/event-view.types";
import type { TrackedChange } from "@/modules/events/domain/event";
import { EventBadges } from "@/modules/events/presentation/components/EventBadges";
import { EventDate } from "@/modules/events/presentation/components/EventDate";
import {
  EventAboutAndPlace,
  EventCancellation,
  EventPresenter,
  EventWhenWhere,
} from "@/modules/events/presentation/components/EventInfo";

/**
 * Fiche d'un événement (US-01), sur le modèle d'une page d'événement : à
 * gauche la photo, la page organisatrice et les catégories ; à droite le nom,
 * la date, le lieu, les actions, puis la description et le lieu. Sur
 * téléphone, tout s'empile. Les actions et les vues dépendent des droits.
 *
 * L'affiche a une largeur fixe sur ordinateur (360 px) et toute la largeur
 * sur téléphone ; sa hauteur suit ses proportions, sans dépasser 80 % de
 * l'écran (une affiche très haute est alors montrée en entier, réduite).
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
  const cancelled = event.status === "cancelled";
  return (
    <div className="mx-auto grid max-w-[1000px] grid-cols-1 gap-8 px-4 md:grid-cols-[360px_minmax(0,1fr)] md:gap-10">
      {/* Colonnes bornées : ni l'affiche ni un long nom de page ne débordent sur le texte */}
      <aside className="grid min-w-0 grid-cols-1 content-start gap-6">
        <div className="w-full overflow-hidden rounded-xl bg-muted">
          <ProgressiveImage
            src={eventImage(event)}
            {...layoutProps(event)}
            priority
            fit="contain"
            className="max-h-[80svh] w-full"
            imageClassName={cn(cancelled && "grayscale")}
          />
        </div>
        <EventPresenter event={event} />
        <div className="flex flex-wrap gap-1.5">
          {event.categories.map((c) => (
            <span
              key={c}
              className="rounded-full border px-2.5 py-0.5 text-sm text-muted-foreground"
            >
              # {t(`categories.${c}`)}
            </span>
          ))}
        </div>
        {views}
      </aside>

      <div className="grid min-w-0 grid-cols-1 content-start gap-6">
        <div className="grid gap-3">
          <h1
            className={cn(
              "text-3xl leading-tight font-bold break-words md:text-4xl",
              cancelled && "text-muted-foreground line-through",
            )}
          >
            {event.name}
          </h1>
          <EventBadges status={event.status} period={event.period} />
        </div>
        <EventWhenWhere event={event} />
        <EventCancellation event={event} />
        {event.status === "updated" && event.latestUpdate && (
          <LatestUpdate
            at={event.latestUpdate.at}
            changes={event.latestUpdate.changes}
          />
        )}
        <section className="overflow-hidden rounded-xl border">
          <h2 className="bg-muted px-4 py-2 text-sm text-muted-foreground">
            {t("events.sheet.actions")}
          </h2>
          <div className="flex flex-wrap gap-2 p-4">{actions}</div>
        </section>
        <EventAboutAndPlace event={event} showCategories={false} />
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
