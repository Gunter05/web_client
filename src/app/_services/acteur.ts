import "server-only";
import { cache } from "react";
import { definirPageActive, sessionCourante } from "@/modules/identite/server";
import { pageParId, pagesDuMembre } from "@/modules/pages/server";
import {
  type EtatProfilActif,
  type ProfilPage,
  resoudreProfilActif,
} from "@/modules/profil-actif";

export function profilsDePages(compteId: string): ProfilPage[] {
  return pagesDuMembre(compteId).map((p) => ({
    type: "page",
    id: p.id,
    nom: p.nom,
    photo: p.photo,
    slug: p.slug,
    role: p.role,
  }));
}

/**
 * Personne connectée et profil actif (US-37), lus une fois par requête.
 * Compose les modules identite, pages et profil-actif. Si l'accès à la page
 * active a été retiré, la session revient au profil personnel.
 */
export const acteurCourant = cache(async () => {
  const courante = await sessionCourante();
  if (!courante) return null;
  const { compte, session } = courante;
  const { etat, reinitialiser } = resoudreProfilActif({
    compte,
    pageActiveId: session.pageActiveId,
    pagesDuMembre: profilsDePages(compte.id),
    nomDePage: (id) => pageParId(id)?.nom ?? null,
  });
  if (reinitialiser) definirPageActive(session.token, null);
  return { compte, session, etat };
});

export async function profilActif(): Promise<EtatProfilActif | null> {
  return (await acteurCourant())?.etat ?? null;
}

/** Page active de l'acteur, ou null s'il agit en son nom propre. */
export function pageActive(etat: EtatProfilActif | null): ProfilPage | null {
  return etat?.actif.type === "page" ? etat.actif : null;
}
