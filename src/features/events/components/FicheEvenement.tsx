import { AvatarProfil } from "@/shared/components/AvatarProfil";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import {
  AlertTriangleIcon,
  BanIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { ReactNode } from "react";
import type { EvenementAffiche } from "@/features/events/types/affichage.types";
import type { Changement } from "@/features/events/lib/evenement";
import { BadgesEvenement } from "@/features/events/components/Badges";
import { IMAGE_PAR_DEFAUT } from "@/features/events/components/CarteEvenement";
import { DateEvenement } from "@/features/events/components/DateEvenement";

/**
 * Fiche d'un événement (US-01), accessible sans compte. Les actions (partager,
 * modifier, annuler) et le compteur de vues sont fournis par la page appelante
 * selon les droits de la personne (membre ou non de la page organisatrice).
 */
export function FicheEvenement({
  evenement,
  actions,
  vues,
}: {
  evenement: EvenementAffiche;
  actions: ReactNode;
  vues?: ReactNode;
}) {
  const t = useTranslations();
  const annule = evenement.statut === "annule";
  return (
    <article className="grid overflow-hidden bg-card sm:rounded-xl sm:border md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <div className="relative aspect-square bg-muted md:aspect-auto md:min-h-full">
        {/* eslint-disable-next-line @next/next/no-img-element -- images simulées (SVG) */}
        <img
          src={evenement.photo ?? IMAGE_PAR_DEFAUT}
          alt=""
          className={cn(
            "size-full object-cover md:absolute md:inset-0",
            annule && "grayscale",
          )}
        />
      </div>

      <div className="flex min-w-0 flex-col">
        <header className="flex items-center gap-3 border-b px-4 py-3">
          <Link
            href={`/p/${evenement.page.slug}`}
            className="flex min-w-0 items-center gap-2.5"
          >
            <AvatarProfil
              nom={evenement.page.nom}
              photo={evenement.page.photo}
              taille="sm"
              anneau
            />
            <span className="truncate text-sm font-semibold">
              {evenement.page.nom}
            </span>
          </Link>
          <BadgesEvenement
            statut={evenement.statut}
            periode={evenement.periode}
            className="ml-auto justify-end"
          />
        </header>

        <div className="grid gap-5 p-4">
          {annule && evenement.annulation && (
            <div
              role="status"
              className="flex gap-3 rounded-lg border border-destructive/40 bg-danger-fond p-3 text-sm"
            >
              <BanIcon className="mt-0.5 size-4 shrink-0 text-danger" />
              <div className="grid gap-1">
                <p className="font-semibold text-danger">
                  {t("statuts.annule")} ·{" "}
                  <DateEvenement iso={evenement.annulation.le} />
                </p>
                <p>
                  <span className="text-muted-foreground">
                    {t("evenements.motif")}{" "}
                  </span>
                  {evenement.annulation.motif}
                </p>
              </div>
            </div>
          )}

          <h1
            className={cn(
              "text-2xl leading-tight font-bold",
              annule && "text-muted-foreground line-through",
            )}
          >
            {evenement.nom}
          </h1>

          <dl className="grid gap-3 text-sm">
            <Info
              icone={<CalendarIcon />}
              libelle={
                evenement.fin ? t("evenements.du") : t("evenements.debut")
              }
            >
              <DateEvenement
                iso={evenement.debut}
                className="font-medium first-letter:uppercase"
              />
            </Info>
            {evenement.fin && (
              <Info icone={<ClockIcon />} libelle={t("evenements.au")}>
                <DateEvenement
                  iso={evenement.fin}
                  className="font-medium first-letter:uppercase"
                />
              </Info>
            )}
            <Info icone={<MapPinIcon />} libelle={t("evenements.lieu")}>
              <span className="font-medium">{evenement.lieu}</span>
            </Info>
          </dl>

          <div className="flex flex-wrap gap-1.5">
            {evenement.categories.map((c) => (
              <Badge key={c} variant="secondary">
                {t(`categories.${c}`)}
              </Badge>
            ))}
          </div>

          {evenement.description && (
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {evenement.description}
            </p>
          )}

          {evenement.statut === "modifie" && evenement.derniereModification && (
            <DerniereModification
              le={evenement.derniereModification.le}
              changements={evenement.derniereModification.changements}
            />
          )}

          {vues}
        </div>

        <footer className="mt-auto flex flex-wrap gap-2 border-t p-4">
          {actions}
        </footer>
      </div>
    </article>
  );
}

function Info({
  icone,
  libelle,
  children,
}: {
  icone: ReactNode;
  libelle: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-muted-foreground [&_svg]:size-4">
        {icone}
      </span>
      <div className="grid">
        <dt className="text-xs text-muted-foreground">{libelle}</dt>
        <dd>{children}</dd>
      </div>
    </div>
  );
}

/** Ancienne et nouvelle valeur de chaque champ changé lors de la dernière modification (US-15). */
function DerniereModification({
  le,
  changements,
}: {
  le: string;
  changements: Changement[];
}) {
  const t = useTranslations("evenements");
  const valeur = (c: Changement, v: string | null) =>
    v === null ? (
      t("sansFin")
    ) : c.champ === "lieu" ? (
      v
    ) : (
      <DateEvenement iso={v} className="first-letter:uppercase" />
    );
  return (
    <section className="grid gap-2 rounded-lg border border-avertissement/40 bg-avertissement-fond p-3 text-sm">
      <p className="flex items-center gap-2 font-semibold text-avertissement">
        <AlertTriangleIcon className="size-4" />
        <span>
          {t("derniereModification")} <DateEvenement iso={le} />
        </span>
      </p>
      <table className="w-full text-left">
        <thead className="text-xs text-muted-foreground">
          <tr>
            <th className="py-1 pr-2 font-normal" />
            <th className="py-1 pr-2 font-normal">{t("avant")}</th>
            <th className="py-1 font-normal">{t("apres")}</th>
          </tr>
        </thead>
        <tbody>
          {changements.map((c) => (
            <tr key={c.champ} className="align-top">
              <th className="py-1 pr-2 font-medium">
                {t(`champsModifies.${c.champ}`)}
              </th>
              <td className="py-1 pr-2 text-muted-foreground line-through">
                {valeur(c, c.avant)}
              </td>
              <td className="py-1 font-medium">{valeur(c, c.apres)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
