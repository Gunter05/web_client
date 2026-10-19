"use client";

import { CheckCircle2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";
import { Skeleton } from "@/shared/ui/skeleton";
import type { EventView } from "@/modules/events/domain/event-view.types";
import type { UrlFilters } from "@/modules/events/domain/url-filters";
import { EventCard } from "@/modules/events/presentation/components/EventCard";

export type LoadEvents = (
  filters: UrlFilters,
  offset: number,
) => Promise<{ events: EventView[]; nextOffset: number | null }>;

/** Fil infini : 20 événements, puis 20 de plus en atteignant le bas (US-16). */
export function EventFeed({
  initialEvents,
  initialNext,
  filters,
  load,
  onShare,
}: {
  initialEvents: EventView[];
  initialNext: number | null;
  filters: UrlFilters;
  load: LoadEvents;
  onShare?: (eventId: string) => Promise<void>;
}) {
  const t = useTranslations("events");
  const [events, setEvents] = useState(initialEvents);
  const [next, setNext] = useState(initialNext);
  const [enCours, startTransition] = useTransition();
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = sentinel.current;
    if (!target || next === null) return;
    const observer = new IntersectionObserver(
      ([input]) => {
        if (!input?.isIntersecting || enCours) return;
        startTransition(async () => {
          const page = await load(filters, next);
          setEvents((l) => [...l, ...page.events]);
          setNext(page.nextOffset);
        });
      },
      { rootMargin: "600px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [next, filters, enCours, load]);

  return (
    <div className="grid gap-0 sm:gap-6">
      {events.map((e, i) => (
        <EventCard key={e.id} event={e} priority={i < 2} onShare={onShare} />
      ))}
      <div ref={sentinel} aria-hidden />
      {enCours && <Skeleton className="aspect-square w-full sm:rounded-xl" />}
      {next === null && events.length > 0 && (
        <p className="flex flex-col items-center gap-2 py-10 text-sm text-muted-foreground">
          <CheckCircle2Icon className="size-8" />
          {t("endOfList")}
        </p>
      )}
    </div>
  );
}
