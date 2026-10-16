import { CalendarXIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import {
  BarreFiltres,
  estParDefaut,
  FilEvenements,
  lireFiltresUrl,
} from "@/modules/evenements";
import { CarrouselPages } from "@/modules/pages";
import { actionChargerEvenements } from "../_actions/evenements";
import { listerDepuisUrl, pagesDuFiltre } from "../_services/affichage";
import { Suspense } from "react";
import { SqueletteContenu } from "@/app/(public)/_coque/squelette";

/** Accueil = liste publique des événements, sans compte (US-01, US-16, US-17). */
async function Accueil({ searchParams }: PageProps<"/">) {
  const t = await getTranslations("evenements");
  const filtres = lireFiltresUrl(await searchParams);
  const { evenements, suivant } = listerDepuisUrl(filtres);
  const pages = pagesDuFiltre();

  return (
    <div className="mx-auto grid max-w-[470px] gap-4 pt-4 sm:px-4 md:pt-8">
      <h1 className="sr-only">{t("listeTitre")}</h1>
      <div className="grid gap-4 px-4 sm:px-0">
        <CarrouselPages pages={pages} />
        <BarreFiltres filtres={filtres} pages={pages} />
      </div>
      {evenements.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-4 py-20 text-center text-muted-foreground">
          <CalendarXIcon className="size-10" />
          <p>{estParDefaut(filtres) ? t("aucunAVenir") : t("aucunFiltre")}</p>
        </div>
      ) : (
        <FilEvenements
          // La clé réinitialise le fil quand les filtres changent.
          key={JSON.stringify(filtres)}
          initiaux={evenements}
          suivantInitial={suivant}
          filtres={filtres}
          charger={actionChargerEvenements}
        />
      )}
    </div>
  );
}

/**
 * Les paramètres d'URL et la session sont lus dans Accueil, derrière ce
 * Suspense : le cadre de la page reste instantané (Cache Components).
 */
export default function Page(props: PageProps<"/">) {
  return (
    <Suspense fallback={<SqueletteContenu />}>
      <Accueil {...props} />
    </Suspense>
  );
}
