import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";
import { useTranslations } from "next-intl";
import type { Period, EventStatus } from "@/modules/events/domain/event";

/**
 * Badges Modifié / Annulé / En cours : texte explicite, pas seulement une
 * couleur (US-15). `compact` (carte du fil) ne garde qu'Annulé et Terminé :
 * la fiche montre les autres.
 */
export function EventBadges({
  status,
  period,
  compact = false,
  className,
}: {
  status: EventStatus;
  period: Period;
  compact?: boolean;
  className?: string;
}) {
  const t = useTranslations();
  return (
    <span className={cn("flex flex-wrap gap-1.5", className)}>
      {!compact && period === "ongoing" && status !== "cancelled" && (
        <Badge className="gap-1.5 bg-succes text-white">
          <span
            className="size-1.5 animate-pulse rounded-full bg-white"
            aria-hidden
          />
          {t("periods.ongoing")}
        </Badge>
      )}
      {!compact && status === "updated" && (
        <Badge
          variant="outline"
          className="border-avertissement bg-avertissement-fond text-avertissement"
        >
          {t("statuses.updated")}
        </Badge>
      )}
      {status === "cancelled" && (
        <Badge
          variant="outline"
          className="border-danger bg-danger-fond text-danger"
        >
          {t("statuses.cancelled")}
        </Badge>
      )}
      {period === "past" && status !== "cancelled" && (
        <Badge variant="secondary">{t("periods.past")}</Badge>
      )}
    </span>
  );
}
