import "server-only";
import {
  type Evenement,
  type FiltresUrl,
  type PageResumee,
} from "@/modules/evenements";
import {
  afficher,
  idsPagesAvecEvenements,
  listerEvenements,
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
