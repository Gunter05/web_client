"use client";

import {
  ArrowUpRightIcon,
  CaretDoubleRightIcon,
  CaretDownIcon,
  CaretUpIcon,
  CopyIcon,
} from "@/shared/components/icons";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/shared/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/shared/ui/sheet";
import type { EventView } from "@/modules/events/domain/event-view.types";
import { EventOverview } from "@/modules/events/presentation/components/EventOverview";

/**
 * Aperçu d'un événement dans un panneau à droite, sans quitter le fil :
 * barre d'outils (fermer, copier le lien, page de l'événement, précédent /
 * suivant), puis image, nom, organisateur, date, lieu, description et page
 * organisatrice. La fiche complète reste sur /e/{id}.
 */
export function EventSheet({
  events,
  openId,
  onSelect,
  onView,
}: {
  events: EventView[];
  openId: string | null;
  /** `null` ferme le panneau. */
  onSelect: (id: string | null) => void;
  /** Mesure de la consultation (vue unique, US-39). */
  onView?: (eventId: string, fromShareLink: boolean) => Promise<void>;
}) {
  const t = useTranslations("events.sheet");
  const index = events.findIndex((e) => e.id === openId);
  const event = index >= 0 ? events[index] : undefined;
  const previous = index > 0 ? events[index - 1] : undefined;
  const next = index >= 0 ? events[index + 1] : undefined;

  useEffect(() => {
    if (event) void onView?.(event.id, false);
  }, [event, onView]);

  async function copyLink() {
    if (!event) return;
    await navigator.clipboard.writeText(
      `${window.location.origin}/e/${event.id}`,
    );
    toast.success(t("linkCopied"));
  }

  return (
    <Sheet open={!!event} onOpenChange={(open) => !open && onSelect(null)}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full gap-0 overflow-hidden shadow-none data-[side=right]:w-full data-[side=right]:sm:inset-y-2 data-[side=right]:sm:right-2 data-[side=right]:sm:h-auto data-[side=right]:sm:w-[560px] data-[side=right]:sm:max-w-[calc(100vw-1rem)] data-[side=right]:sm:rounded-xl data-[side=right]:sm:border"
      >
        {event && (
          <>
            <div className="flex items-center gap-2 border-b px-3 py-2">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onSelect(null)}
                aria-label={t("close")}
              >
                <CaretDoubleRightIcon />
              </Button>
              <Button variant="secondary" size="sm" onClick={copyLink}>
                <CopyIcon /> {t("copyLink")}
              </Button>
              <Link
                href={`/e/${event.id}`}
                className={buttonVariants({ variant: "secondary", size: "sm" })}
              >
                {t("eventPage")} <ArrowUpRightIcon />
              </Link>
              <div className="ml-auto flex gap-1">
                <Button
                  variant="secondary"
                  size="icon-sm"
                  disabled={!previous}
                  onClick={() => previous && onSelect(previous.id)}
                  aria-label={t("previous")}
                >
                  <CaretUpIcon />
                </Button>
                <Button
                  variant="secondary"
                  size="icon-sm"
                  disabled={!next}
                  onClick={() => next && onSelect(next.id)}
                  aria-label={t("next")}
                >
                  <CaretDownIcon />
                </Button>
              </div>
            </div>
            {/* La clé remet le défilement en haut à chaque événement. */}
            <div key={event.id} className="flex-1 overflow-y-auto">
              <EventOverview
                event={event}
                title={(props) => <SheetTitle {...props} />}
              />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
