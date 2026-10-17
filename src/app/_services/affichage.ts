import "server-only";
import {
  type Categorie,
  correspondRecherche,
  type Evenement,
  type FiltresUrl,
  type PageResumee,
  PERIODES,
  type Periode,
} from "@/modules/evenements";
import {
  afficher,
  idsPagesAvecEvenements,
  listerEvenements,
  listerTousLesEvenements,
} from "@/modules/evenements/server";
import { pageParSlug, pagesParIds } from "@/modules/pages/server";

function resumes(ids: readonly string[]): Map<string, PageResumee> {
  return new Map(
    [...pagesParIds(ids).values()].map((p) => [
      p.id,
      { id: p.id, nom: p.nom, slug: p.slug, photo: p.photo },
    ]),
  );
}

/** Joint à chaque événement sa page organisatrice (modules evenements + pages). */
export function afficherEvenements(evenements: readonly Evenement[]) {
  return afficher(evenements, resumes(evenements.map((e) => e.pageId)));
}

/** Liste filtrée par l'adresse (US-17) : les pages y sont désignées par leur slug. */
export function listerDepuisUrl(filtres: FiltresUrl, depuis = 0) {
  const pages = filtres.pages.map(
    (slug) => pageParSlug(slug)?.id ?? `inconnue:${slug}`,
  );
  const { evenements, suivant } = listerEvenements(
    { ...filtres, pages },
    depuis,
  );
  return { evenements: afficherEvenements(evenements), suivant };
}

/** Choix du filtre Page : les pages ayant au moins un événement. */
export function pagesDuFiltre(): PageResumee[] {
  return [...resumes(idsPagesAvecEvenements()).values()].sort((a, b) =>
    a.nom.localeCompare(b.nom),
  );
}

/** Nombre maximal de vignettes affichées par une recherche. */
const RESULTATS_MAX = 60;

/**
 * Recherche (onglet Rechercher) : texte sur le nom, le lieu, la description
 * et la page organisatrice ; période unique ou toutes ; catégories (OU).
 */
export function rechercherEvenements(r: {
  texte: string;
  periode: Periode | null;
  categories: Categorie[];
}) {
  const trouves = afficherEvenements(
    listerTousLesEvenements({
      categories: r.categories,
      periodes: r.periode ? [r.periode] : [...PERIODES],
      pages: [],
    }),
  ).filter((e) =>
    correspondRecherche([e.nom, e.lieu, e.description, e.page.nom], r.texte),
  );
  return { evenements: trouves.slice(0, RESULTATS_MAX), total: trouves.length };
}
