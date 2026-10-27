"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import { enUS, fr } from "react-day-picker/locale";
import { CalendarBlankIcon } from "@/shared/components/icons";
import { cn } from "@/shared/lib/utils";
import { Calendar } from "@/shared/ui/calendar";
import { Input } from "@/shared/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

/** « 2026-10-25 » ↔ Date locale (minuit, heure de l'appareil). */
const toDate = (value: string) =>
  value ? new Date(`${value}T00:00`) : undefined;
const toValue = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/**
 * Date et heure d'un événement avec les composants shadcn : la date dans un
 * calendrier ouvert depuis un bouton, l'heure dans un champ `time`. Les
 * valeurs restent des textes (« 2026-10-25 », « 18:00 ») ; la conversion en
 * UTC se fait à l'envoi du formulaire.
 */
export function DateTimeField({
  label,
  field,
  date,
  time,
  onDate,
  onTime,
  invalid,
  placeholder,
  min,
}: {
  label: string;
  /** Nom du champ, pour y placer le curseur en cas d'erreur. */
  field?: string;
  date: string;
  time: string;
  onDate: (value: string) => void;
  onTime: (value: string) => void;
  invalid?: boolean;
  /** Texte du bouton tant qu'aucune date n'est choisie. */
  placeholder: string;
  /** Premier jour choisissable (« 2026-10-25 ») ; les jours d'avant sont grisés. */
  min?: string;
}) {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const selected = toDate(date);
  const shown = selected
    ? new Intl.DateTimeFormat(locale, {
        weekday: "short",
        day: "numeric",
        month: "short",
      }).format(selected)
    : placeholder;

  return (
    <div className="flex min-w-0 flex-1 gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          aria-label={`${label} : date`}
          aria-invalid={invalid}
          data-field={field}
          className={cn(
            "flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg bg-background/70 px-3 text-left text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring aria-invalid:ring-2 aria-invalid:ring-destructive/50",
            !selected && "font-normal text-muted-foreground",
          )}
        >
          <CalendarBlankIcon className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate first-letter:uppercase">{shown}</span>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            locale={locale === "fr" ? fr : enUS}
            selected={selected}
            defaultMonth={selected ?? toDate(min ?? "")}
            disabled={min ? { before: toDate(min)! } : undefined}
            onSelect={(d) => {
              if (d) onDate(toValue(d));
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      <Input
        type="time"
        value={time}
        onChange={(e) => onTime(e.target.value)}
        aria-label={`${label} : heure`}
        aria-invalid={invalid}
        className="h-10 w-28 shrink-0 border-transparent bg-background/70 font-medium"
      />
    </div>
  );
}
