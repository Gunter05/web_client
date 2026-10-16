import { cn } from "@/shared/lib/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { EvenementAffiche } from "../domain/affichage";
import { IMAGE_PAR_DEFAUT } from "./carte-evenement";

/** Grille de vignettes carrées, comme la grille d'un profil Instagram. */
export function GrilleEvenements({
  evenements,
}: {
  evenements: EvenementAffiche[];
}) {
  const t = useTranslations();
  return (
    <ul className="grid grid-cols-3 gap-0.5 sm:gap-1">
      {evenements.map((e) => (
        <li key={e.id}>
          <Link
            href={`/e/${e.id}`}
            className="group relative block aspect-square overflow-hidden bg-muted"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- images simulées (SVG) */}
            <img
              src={e.photo ?? IMAGE_PAR_DEFAUT}
              alt=""
              loading="lazy"
              className={cn(
                "size-full object-cover",
                e.statut === "annule" && "grayscale",
              )}
            />
            <span className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent p-2 text-left text-xs font-semibold text-white">
              <span className="line-clamp-2">{e.nom}</span>
            </span>
            {(e.statut !== "publie" || e.periode !== "a_venir") && (
              <span className="absolute top-1.5 right-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                {e.statut === "publie"
                  ? t(`periodes.${e.periode}`)
                  : t(`statuts.${e.statut}`)}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
