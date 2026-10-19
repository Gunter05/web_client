import "server-only";
import { listerEvenements } from "@/features/events/api/liste";
import {
  type Categorie,
  PERIODES,
  type Periode,
} from "@/features/events/lib/evenement";
import type { FiltresUrl } from "@/features/events/lib/filtres-url";
import type { PageResumee } from "@/features/events/types/affichage.types";
import { toutesLesPages } from "@/features/pages/server";

/** Liste filtrée par l'adresse (US-17) ; les pages y sont désignées par leur slug. */
export function listerDepuisUrl(filtres: FiltresUrl, depuis = 0) {
  return listerEvenements(filtres, depuis);
}

/** Choix du filtre Page et carrousel de l'accueil. */
export async function pagesDuFiltre(): Promise<PageResumee[]> {
  return (await toutesLesPages()).map((p) => ({
    id: p.id,
    nom: p.nom,
    slug: p.slug,
    photo: p.photo,
  }));
}

/** Nombre maximal de vignettes affichées par une recherche. */
const RESULTATS_MAX = 60;

/**
 * Recherche (onglet Rechercher) : texte sur le nom, le lieu, la description
 * et la page organisatrice ; période unique ou toutes ; catégories (OU).
 */
export async function rechercherEvenements(r: {
  texte: string;
  periode: Periode | null;
  categories: Categorie[];
}) {
  const { evenements, total } = await listerEvenements(
    {
      categories: r.categories,
      periodes: r.periode ? [r.periode] : [...PERIODES],
      pages: [],
      recherche: r.texte,
    },
    0,
    RESULTATS_MAX,
  );
  return { evenements, total };
}
