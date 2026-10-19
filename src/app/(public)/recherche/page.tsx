import { SearchXIcon } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import {
  BarreRecherche,
  GrilleEvenements,
  lireFiltresUrl,
  PastillesFiltres,
  PERIODES,
  type Periode,
} from "@/modules/evenements";
import { rechercherEvenements } from "../../_services/affichage";
import { SqueletteContenu } from "../_coque/squelette";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("recherche");
  return { title: t("titre") };
}

/**
 * Onglet Rechercher, façon Explorer d'Instagram : champ en haut, filtres en
 * pastilles (période, catégories), grille de vignettes. Sans compte.
 */
async function Recherche({ searchParams }: PageProps<"/recherche">) {
  const t = await getTranslations("recherche");
  const params = await searchParams;
  const texte = typeof params.q === "string" ? params.q : "";
  const brut = typeof params.periode === "string" ? params.periode : "";
  const periode = (PERIODES as readonly string[]).includes(brut)
    ? (brut as Periode)
    : null;
  const { categories } = lireFiltresUrl(params);
  const { evenements, total } = await rechercherEvenements({
    texte,
    periode,
    categories,
  });

  return (
    <div className="mx-auto grid max-w-5xl gap-4 px-4 pt-4 md:pt-6">
      <h1 className="sr-only">{t("titre")}</h1>
      <div className="mx-auto w-full max-w-2xl">
        <BarreRecherche valeur={texte} />
      </div>
      <PastillesFiltres periode={periode} categories={categories} />
      <p role="status" className="text-sm text-muted-foreground">
        {t("resultats", { n: total })}
      </p>
      {evenements.length ? (
        <GrilleEvenements
          evenements={evenements}
          className="-mx-4 sm:mx-0 md:grid-cols-4 lg:grid-cols-5"
        />
      ) : (
        <div className="flex flex-col items-center gap-3 py-20 text-center text-muted-foreground">
          <SearchXIcon className="size-10" />
          <p>{t("aucunResultat")}</p>
        </div>
      )}
    </div>
  );
}

/** La recherche vient de l'adresse : lue derrière ce Suspense (Cache Components). */
export default function Page(props: PageProps<"/recherche">) {
  return (
    <Suspense fallback={<SqueletteContenu />}>
      <Recherche {...props} />
    </Suspense>
  );
}
