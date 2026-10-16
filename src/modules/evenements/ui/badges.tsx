import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";
import { useTranslations } from "next-intl";
import type { Periode, Statut } from "../domain/evenement";

/** Badges Modifié / Annulé / En cours : texte explicite, pas seulement une couleur (US-15). */
export function BadgesEvenement({
  statut,
  periode,
  className,
}: {
  statut: Statut;
  periode: Periode;
  className?: string;
}) {
  const t = useTranslations();
  return (
    <span className={cn("flex flex-wrap gap-1.5", className)}>
      {periode === "en_cours" && statut !== "annule" && (
        <Badge className="gap-1.5 bg-succes text-white">
          <span
            className="size-1.5 animate-pulse rounded-full bg-white"
            aria-hidden
          />
          {t("periodes.en_cours")}
        </Badge>
      )}
      {statut === "modifie" && (
        <Badge
          variant="outline"
          className="border-avertissement bg-avertissement-fond text-avertissement"
        >
          {t("statuts.modifie")}
        </Badge>
      )}
      {statut === "annule" && (
        <Badge
          variant="outline"
          className="border-destructive bg-danger-fond text-destructive"
        >
          {t("statuts.annule")}
        </Badge>
      )}
      {periode === "passe" && statut !== "annule" && (
        <Badge variant="secondary">{t("periodes.passe")}</Badge>
      )}
    </span>
  );
}
