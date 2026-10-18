import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { compteCourant } from "@/modules/identite/server";
import { pagesDuMembre, toutesLesPages } from "@/modules/pages/server";
import {
  type EtatProfilActif,
  type ProfilPage,
  resoudreProfilActif,
} from "@/modules/profil-actif";

/** Page au nom de laquelle on agit (US-37) ; l'API revérifie l'appartenance. */
const COOKIE_PAGE_ACTIVE = "contineng_page_active";

export async function lirePageActive(): Promise<string | null> {
  return (await cookies()).get(COOKIE_PAGE_ACTIVE)?.value ?? null;
}

/** À appeler depuis une Server Action. `null` revient au profil personnel. */
export async function ecrirePageActive(pageId: string | null): Promise<void> {
  const jar = await cookies();
  if (pageId) {
    jar.set(COOKIE_PAGE_ACTIVE, pageId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  } else {
    jar.delete(COOKIE_PAGE_ACTIVE);
  }
}

export const profilsDePages = cache(async (): Promise<ProfilPage[]> =>
  (await pagesDuMembre()).map(({ page, role }) => ({
    type: "page",
    id: page.id,
    nom: page.nom,
    photo: page.photo,
    slug: page.slug,
    role,
  })),
);

/**
 * Personne connectée et profil actif (US-37), lus une fois par requête. Si
 * l'accès à la page active a été retiré, le profil personnel redevient actif
 * et la perte est signalée (l'alerte efface ensuite le cookie).
 */
export const acteurCourant = cache(async () => {
  const compte = await compteCourant();
  if (!compte) return null;
  const pageActiveId = await lirePageActive();
  const pages = await profilsDePages();
  const toutes =
    pageActiveId && !pages.some((p) => p.id === pageActiveId)
      ? await toutesLesPages()
      : [];
  const { etat } = resoudreProfilActif({
    compte,
    pageActiveId,
    pagesDuMembre: pages,
    nomDePage: (id) => toutes.find((p) => p.id === id)?.nom ?? null,
  });
  return { compte, etat };
});

export async function profilActif(): Promise<EtatProfilActif | null> {
  return (await acteurCourant())?.etat ?? null;
}

/** Page active de l'acteur, ou null s'il agit en son nom propre. */
export function pageActive(etat: EtatProfilActif | null): ProfilPage | null {
  return etat?.actif.type === "page" ? etat.actif : null;
}
