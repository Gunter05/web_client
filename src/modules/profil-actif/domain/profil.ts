/** Profil au nom duquel l'utilisateur agit (US-37). */
export type ProfilPersonnel = {
  type: "personnel";
  id: string;
  nom: string;
  photo: string | null;
};

export type ProfilPage = {
  type: "page";
  id: string;
  nom: string;
  photo: string | null;
  slug: string;
  role: "proprietaire" | "contributeur";
};

export type Profil = ProfilPersonnel | ProfilPage;

export type EtatProfilActif = {
  compteId: string;
  estAdmin: boolean;
  actif: Profil;
  profils: Profil[];
  /** Nom de la page dont l'accès vient d'être perdu (message affiché une fois). */
  accesPerdu: string | null;
};

export type Entree = {
  compte: { id: string; nom: string; photo: string | null; estAdmin: boolean };
  pageActiveId: string | null;
  pagesDuMembre: ProfilPage[];
  nomDePage: (pageId: string) => string | null;
};

/**
 * Calcule le profil actif. Un compte donne un profil personnel et un profil
 * par page dont il est membre. Si l'accès à la page active a été retiré, le
 * profil actif redevient le profil personnel et la perte est signalée ;
 * `reinitialiser` indique à l'appelant d'effacer la page active de la session.
 */
export function resoudreProfilActif(e: Entree): {
  etat: EtatProfilActif;
  reinitialiser: boolean;
} {
  const personnel: ProfilPersonnel = {
    type: "personnel",
    id: e.compte.id,
    nom: e.compte.nom,
    photo: e.compte.photo,
  };
  const page = e.pageActiveId
    ? e.pagesDuMembre.find((p) => p.id === e.pageActiveId)
    : undefined;
  const perdu = e.pageActiveId !== null && !page;
  return {
    etat: {
      compteId: e.compte.id,
      estAdmin: e.compte.estAdmin,
      actif: page ?? personnel,
      profils: [personnel, ...e.pagesDuMembre],
      accesPerdu: perdu && e.pageActiveId ? e.nomDePage(e.pageActiveId) : null,
    },
    reinitialiser: perdu,
  };
}

/** Une page ne peut devenir active que si le compte en est membre. */
export function peutActiver(pageId: string | null, pages: ProfilPage[]) {
  return pageId === null || pages.some((p) => p.id === pageId);
}
