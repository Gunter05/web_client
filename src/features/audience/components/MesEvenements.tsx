import { EyeIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { DateEvenement, type EvenementAffiche } from "@/features/events";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

/** Événements d'une page dont on est membre, avec le nombre de vues (US-39). */
export function MesEvenements({
  evenements,
  vues,
}: {
  evenements: EvenementAffiche[];
  vues: ReadonlyMap<string, number>;
}) {
  const t = useTranslations();
  if (!evenements.length) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        {t("evenements.mesEvenementsVide")}
      </p>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("evenements.colonneNom")}</TableHead>
            <TableHead className="hidden sm:table-cell">
              {t("evenements.colonneDebut")}
            </TableHead>
            <TableHead>{t("evenements.colonneStatut")}</TableHead>
            <TableHead className="text-right">
              {t("evenements.colonneVues")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {evenements.map((e) => (
            <TableRow key={e.id}>
              <TableCell className="max-w-48 whitespace-normal">
                <Link
                  href={`/e/${e.id}`}
                  className="font-medium hover:underline"
                >
                  {e.nom}
                </Link>
                <DateEvenement
                  iso={e.debut}
                  className="block text-xs text-muted-foreground first-letter:uppercase sm:hidden"
                />
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <DateEvenement
                  iso={e.debut}
                  className="first-letter:uppercase"
                />
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    e.statut === "annule"
                      ? "destructive"
                      : e.statut === "modifie"
                        ? "outline"
                        : "secondary"
                  }
                >
                  {t(`statuts.${e.statut}`)}
                </Badge>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                <span className="inline-flex items-center gap-1.5">
                  <EyeIcon className="size-3.5 text-muted-foreground" />
                  {vues.get(e.id) ?? 0}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
