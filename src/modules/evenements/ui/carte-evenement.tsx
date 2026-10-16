import { AvatarProfil } from "@/shared/composants/avatar-profil";
import { cn } from "@/shared/lib/utils";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { EvenementAffiche } from "../domain/affichage";
import { BadgesEvenement } from "./badges";
import { DateEvenement } from "./date-evenement";

export const IMAGE_PAR_DEFAUT = "/demo/defaut.svg";

/**
 * Carte d'événement façon publication Instagram (US-01) : en-tête avec la page,
 * grande image, puis nom, date, lieu, catégories et badges de statut.
 */
export function CarteEvenement({
  evenement,
  priorite = false,
}: {
  evenement: EvenementAffiche;
  priorite?: boolean;
}) {
  const t = useTranslations();
  const annule = evenement.statut === "annule";
  return (
    <article className="overflow-hidden border-b bg-card pb-4 sm:rounded-xl sm:border">
      <header className="flex items-center gap-3 px-3 py-2.5">
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
      <Link
        href={`/e/${evenement.id}`}
        className="group block"
        aria-label={evenement.nom}
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element -- images simulées (SVG) */}
          <img
            src={evenement.photo ?? IMAGE_PAR_DEFAUT}
            alt=""
            loading={priorite ? "eager" : "lazy"}
            className={cn(
              "size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]",
              annule && "grayscale",
            )}
          />
          {annule && (
            <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 -rotate-6 bg-destructive py-2 text-center text-lg font-bold tracking-widest text-white uppercase">
              {t("statuts.annule")}
            </span>
          )}
        </div>
        <div className="grid gap-1.5 px-3 pt-3">
          <h2
            className={cn(
              "text-base leading-snug font-semibold",
              annule && "text-muted-foreground line-through",
            )}
          >
            {evenement.nom}
          </h2>
          <p className="flex items-center gap-1.5 text-sm">
            <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
            <DateEvenement
              iso={evenement.debut}
              className="first-letter:uppercase"
            />
          </p>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPinIcon className="size-4 shrink-0" />
            <span className="truncate">{evenement.lieu}</span>
          </p>
          <p className="flex flex-wrap gap-x-2 text-sm text-lien">
            {evenement.categories.map((c) => (
              <span key={c}>#{t(`categories.${c}`).replaceAll(" ", "")}</span>
            ))}
          </p>
        </div>
      </Link>
    </article>
  );
}
