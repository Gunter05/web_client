import { EyeIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { EventDate, type EventView } from "@/modules/events";
import { Badge } from "@/shared/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

/** Événements d'une page dont on est membre, avec le nombre de vues (US-39). */
export function EventViewsTable({
  events,
  views,
}: {
  events: EventView[];
  views: ReadonlyMap<string, number>;
}) {
  const t = useTranslations();
  if (!events.length) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        {t("events.myEventsEmpty")}
      </p>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("events.columnName")}</TableHead>
            <TableHead className="hidden sm:table-cell">
              {t("events.columnStart")}
            </TableHead>
            <TableHead>{t("events.columnStatus")}</TableHead>
            <TableHead className="text-right">
              {t("events.columnViews")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((e) => (
            <TableRow key={e.id}>
              <TableCell className="max-w-48 whitespace-normal">
                <Link
                  href={`/e/${e.id}`}
                  className="font-medium hover:underline"
                >
                  {e.name}
                </Link>
                <EventDate
                  iso={e.startsAt}
                  className="block text-xs text-muted-foreground first-letter:uppercase sm:hidden"
                />
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <EventDate
                  iso={e.startsAt}
                  className="first-letter:uppercase"
                />
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    e.status === "cancelled"
                      ? "destructive"
                      : e.status === "updated"
                        ? "outline"
                        : "secondary"
                  }
                >
                  {t(`statuses.${e.status}`)}
                </Badge>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                <span className="inline-flex items-center gap-1.5">
                  <EyeIcon className="size-3.5 text-muted-foreground" />
                  {views.get(e.id) ?? 0}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
