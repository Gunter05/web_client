import { AvatarProfil } from "@/shared/components/AvatarProfil";
import { cn } from "@/shared/lib/utils";
import { MapPinIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { EvenementAffiche } from "@/features/events/types/affichage.types";
import { BadgesEvenement } from "@/features/events/components/Badges";
import { IconePartager } from "@/features/events/components/BoutonPartager";
import { DateEvenement } from "@/features/events/components/DateEvenement";
import { DatePublication } from "@/features/events/components/DatePublication";
import { TuileDate } from "@/features/events/components/TuileDate";

export const IMAGE_PAR_DEFAUT = "/demo/defaut.svg";

/**
 * Carte d'événement façon publication Instagram (US-01) : en-tête avec la
 * page et la date de publication, grande image, tuile de date posée sur son
 * coin, puis nom, date et heure, lieu, catégories et badges de statut.
 */
export function CarteEvenement({
  evenement,
  priorite = false,
  surPartage,
}: {
  evenement: EvenementAffiche;
  priorite?: boolean;
  /** Mesure du clic sur « Partager », fournie par la route (métrique Viralité). */
  surPartage?: (evenementId: string) => Promise<void>;
}) {
  const t = useTranslations();
  const annule = evenement.statut === "annule";
  return (
    <article className="overflow-hidden border-b bg-card pb-4 sm:rounded-xl sm:border-none">
      <header className="flex items-center gap-3 px-3 py-2.5 sm:px-0">
        <Link
          href={`/p/${evenement.page.slug}`}
          className="flex min-w-0 items-center gap-2.5"
        >
          <AvatarProfil
            nom={evenement.page.nom}
            photo={evenement.page.photo}
            taille="md"
          />
          <span className="grid min-w-0">
            <span className="truncate text-sm font-semibold">
              {evenement.page.nom}
            </span>
            <DatePublication
              iso={evenement.creeLe}
              className="text-xs text-muted-foreground"
            />
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
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element -- images simulées (SVG) */}
          <img
            src={evenement.photo ?? IMAGE_PAR_DEFAUT}
            alt=""
            loading={priorite ? "eager" : "lazy"}
            className={cn(
              "size-full rounded-sm object-cover transition-transform duration-500 group-hover:scale-[1.02]",
              annule && "grayscale",
            )}
          />
          {annule && (
            <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 -rotate-6 bg-destructive py-2 text-center text-lg font-bold tracking-widest text-white uppercase">
              {t("statuts.annule")}
            </span>
          )}
        </div>
      </Link>

      {/* Tuile de date posée sur l'image, actions à droite (comme Instagram). */}
      <div className="flex items-start justify-between px-3 sm:px-0">
        <TuileDate iso={evenement.debut} className="relative -mt-7 shrink-0" />
        <IconePartager
          chemin={`/e/${evenement.id}`}
          titre={evenement.nom}
          texte={evenement.nom}
          onPartage={surPartage ? () => surPartage(evenement.id) : undefined}
          className="mt-1 -mr-2"
        />
      </div>

      <div className="grid gap-1 px-3 pt-2 sm:px-0">
        <h2
          className={cn(
            "text-xl leading-snug font-semibold",
            annule && "text-muted-foreground line-through",
          )}
        >
          <Link href={`/e/${evenement.id}`} className="hover:underline">
            {evenement.nom}
          </Link>
        </h2>
        <DateEvenement
          iso={evenement.debut}
          className="text-sm first-letter:uppercase"
        />
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
    </article>
  );
}
