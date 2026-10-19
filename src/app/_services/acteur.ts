import "server-only";
import { cache } from "react";
import { compteCourant } from "@/modules/identite/server";
import type { PageDuMembre } from "@/modules/pages";
import { pagesDuMembre } from "@/modules/pages/server";

/**
 * Pages dont le compte connecté est membre, par nom. On publie toujours au nom
 * de l'une d'elles, choisie au moment d'agir : aucune page « active » n'est
 * mémorisée. L'API revérifie l'appartenance à chaque écriture.
 */
export const mesPages = cache(async (): Promise<PageDuMembre[]> =>
  (await pagesDuMembre()).map(({ page, role }) => ({
    id: page.id,
    slug: page.slug,
    nom: page.nom,
    photo: page.photo,
    role,
  })),
);

/** Personne connectée et ses pages, lues une fois par requête ; null sans session. */
export const acteurCourant = cache(async () => {
  const compte = await compteCourant();
  if (!compte) return null;
  return { compte, pages: await mesPages() };
});

/** Page de l'acteur désignée par son slug, ou null s'il n'en est pas membre. */
export async function maPage(slug: string): Promise<PageDuMembre | null> {
  const acteur = await acteurCourant();
  return acteur?.pages.find((p) => p.slug === slug) ?? null;
}

/** Page de l'acteur désignée par son id, ou null s'il n'en est pas membre. */
export async function maPageParId(id: string): Promise<PageDuMembre | null> {
  const acteur = await acteurCourant();
  return acteur?.pages.find((p) => p.id === id) ?? null;
}
