"use client";

import { PushPinIcon, PushPinSlashIcon } from "@/shared/components/icons";
import { useFormatter, useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useMounted } from "@/shared/hooks/useMounted";
import { deviceTimeZone } from "@/shared/i18n/dates";
import { useErrorMessages } from "@/shared/i18n/errors";
import { Button } from "@/shared/ui/button";

type Result = Promise<{ error?: string }>;

/**
 * Épinglage éditorial d'un événement en tête du fil (ADR 0020 du backend) :
 * durée au choix, ou retrait. Invisible pour les visiteurs.
 */
export function PinControl({
  pinnedUntil,
  days,
  pin,
  unpin,
}: {
  pinnedUntil: string | null;
  days: readonly number[];
  pin: (days: number) => Result;
  unpin: () => Result;
}) {
  const t = useTranslations("admin.events");
  const format = useFormatter();
  const mounted = useMounted();
  const errors = useErrorMessages();
  const [choice, setChoice] = useState(days[0] ?? 1);
  const [pending, start] = useTransition();
  const run = (action: () => Result, done: string) =>
    start(async () => {
      const { error } = await action();
      if (error) toast.error(errors(error));
      else toast.success(done);
    });

  if (pinnedUntil && new Date(pinnedUntil) > new Date()) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">
          {t("pinnedUntil", {
            // Fuseau de l'appareil, connu seulement dans le navigateur (D7)
            date: mounted
              ? format.dateTime(new Date(pinnedUntil), {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: deviceTimeZone(),
                })
              : "…",
          })}
        </span>
        <Button
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => run(unpin, t("unpinned"))}
        >
          <PushPinSlashIcon /> {t("unpin")}
        </Button>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5">
      <select
        aria-label={t("pinFor")}
        value={choice}
        onChange={(e) => setChoice(Number(e.target.value))}
        className="h-7 rounded-md border border-input bg-transparent px-1.5 text-xs"
      >
        {days.map((n) => (
          <option key={n} value={n}>
            {t("days", { n })}
          </option>
        ))}
      </select>
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => run(() => pin(choice), t("pinned"))}
      >
        <PushPinIcon /> {t("pin")}
      </Button>
    </div>
  );
}
