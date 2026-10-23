import "server-only";
import { cache } from "react";
import { getCurrentAccount } from "@/modules/authentication/server";
import { pagesApi } from "@/modules/pages/infrastructure/pages.api";
import type { MemberPage } from "@/modules/pages/domain/page.types";

/**
 * Pages dont le compte connecté est membre, par nom. On publie toujours au nom
 * de l'une d'elles, choisie au moment d'agir : aucune page « active » n'est
 * mémorisée. L'API revérifie l'appartenance à chaque écriture.
 */
export const getMyPages = cache(async (): Promise<MemberPage[]> =>
  (await pagesApi.myPages()).map(({ page, role }) => ({
    id: page.id,
    slug: page.slug,
    name: page.name,
    photoUrl: page.photoUrl,
    role,
  })),
);

/** Personne connectée et ses pages, lues une fois par requête ; null sans session. */
export const getCurrentUser = cache(async () => {
  const account = await getCurrentAccount();
  if (!account) return null;
  return { account, pages: await getMyPages() };
});

/** Page de l'acteur désignée par son slug, ou null s'il n'en est pas membre. */
export async function getMyPage(slug: string): Promise<MemberPage | null> {
  const user = await getCurrentUser();
  return user?.pages.find((p) => p.slug === slug) ?? null;
}

/** Page de l'acteur désignée par son id, ou null s'il n'en est pas membre. */
export async function getMyPageById(id: string): Promise<MemberPage | null> {
  const user = await getCurrentUser();
  return user?.pages.find((p) => p.id === id) ?? null;
}
