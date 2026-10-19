"use client";

import { CheckCircle2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import type { EvenementAffiche } from "@/features/events/types/affichage.types";
import type { FiltresUrl } from "@/features/events/lib/filtres-url";
import { CarteEvenement } from "@/features/events/components/CarteEvenement";

export type ChargerEvenements = (
  filtres: FiltresUrl,
  depuis: number,
) => Promise<{ evenements: EvenementAffiche[]; suivant: number | null }>;

/** Fil infini : 20 événements, puis 20 de plus en atteignant le bas (US-16). */
export function FilEvenements({
  initiaux,
  suivantInitial,
  filtres,
  charger,
  surPartage,
}: {
  initiaux: EvenementAffiche[];
  suivantInitial: number | null;
  filtres: FiltresUrl;
  charger: ChargerEvenements;
  surPartage?: (evenementId: string) => Promise<void>;
}) {
  const t = useTranslations("evenements");
  const [evenements, setEvenements] = useState(initiaux);
  const [suivant, setSuivant] = useState(suivantInitial);
  const [enCours, demarrer] = useTransition();
  const sentinelle = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cible = sentinelle.current;
    if (!cible || suivant === null) return;
    const observateur = new IntersectionObserver(
      ([entree]) => {
        if (!entree?.isIntersecting || enCours) return;
        demarrer(async () => {
          const page = await charger(filtres, suivant);
          setEvenements((l) => [...l, ...page.evenements]);
          setSuivant(page.suivant);
        });
      },
      { rootMargin: "600px" },
    );
    observateur.observe(cible);
    return () => observateur.disconnect();
  }, [suivant, filtres, enCours, charger]);

  return (
    <div className="grid gap-0 sm:gap-6">
      {evenements.map((e, i) => (
        <CarteEvenement
          key={e.id}
          evenement={e}
          priorite={i < 2}
          surPartage={surPartage}
        />
      ))}
      <div ref={sentinelle} aria-hidden />
      {enCours && <Skeleton className="aspect-square w-full sm:rounded-xl" />}
      {suivant === null && evenements.length > 0 && (
        <p className="flex flex-col items-center gap-2 py-10 text-sm text-muted-foreground">
          <CheckCircle2Icon className="size-8" />
          {t("finDeListe")}
        </p>
      )}
    </div>
  );
}
