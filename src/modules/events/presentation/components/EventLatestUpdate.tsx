"use client";

import { WarningIcon } from "@/shared/components/icons";
import { useTranslations } from "next-intl";
import type { TrackedChange } from "@/modules/events/domain/event";
import { EventDate } from "@/modules/events/presentation/components/EventDate";

/** Ancienne et nouvelle valeur de chaque champ changé lors de la dernière modification (US-15). */
export function EventLatestUpdate({
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
        <WarningIcon className="size-4" />
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
