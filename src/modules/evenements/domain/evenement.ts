/** Liste fermée (D3) ; les libellés FR/EN vivent dans le catalogue i18n. */
export const CATEGORIES = [
  "match",
  "interClubs",
  "integration",
  "soiree",
  "culture",
  "conference",
  "vieEcole",
  "autre",
] as const;
export type Categorie = (typeof CATEGORIES)[number];

export const PERIODES = ["en_cours", "a_venir", "passe"] as const;
export type Periode = (typeof PERIODES)[number];

export type Statut = "publie" | "modifie" | "annule";

export type ChampSuivi = "debut" | "fin" | "lieu";
export type Changement = {
  champ: ChampSuivi;
  avant: string | null;
  apres: string | null;
};

export type Evenement = {
  /** Identifiant court, base du lien permanent /e/{id} (US-36). */
  id: string;
  pageId: string;
  nom: string;
  /** Instants ISO en UTC (D7). */
  debut: string;
  fin: string | null;
  lieu: string;
  categories: Categorie[];
  description: string | null;
  photo: string | null;
  statut: Statut;
  derniereModification: { le: string; changements: Changement[] } | null;
  annulation: { motif: string; le: string } | null;
  creeLe: string;
  /** Auteur de chaque action, jamais affiché au public (US-06). */
  journal: {
    action: "creation" | "modification" | "annulation";
    compteId: string;
    le: string;
  }[];
};

// ——— Période (US-16) ———

/** Sans fin, l'événement se termine à 23h59 UTC le jour du début (D5). */
export function finEffective(
  evenement: Pick<Evenement, "debut" | "fin">,
): Date {
  if (evenement.fin) return new Date(evenement.fin);
  const fin = new Date(evenement.debut);
  fin.setUTCHours(23, 59, 59, 999);
  return fin;
}

export function periodeDe(
  evenement: Pick<Evenement, "debut" | "fin">,
  maintenant: Date,
): Periode {
  if (maintenant < new Date(evenement.debut)) return "a_venir";
  if (maintenant <= finEffective(evenement)) return "en_cours";
  return "passe";
}

// ——— Formulaire (US-11, US-15) ———

export type FormulaireEvenement = {
  nom: string;
  debut: string;
  fin: string;
  lieu: string;
  categories: string[];
  description: string;
};

export type DonneesEvenement = Pick<
  Evenement,
  "nom" | "debut" | "fin" | "lieu" | "categories" | "description"
>;

export type ErreursChamps = Record<string, string>;

export type Validation =
  | { ok: true; donnees: DonneesEvenement }
  | { ok: false; champs: ErreursChamps };

function instant(valeur: string): Date | null {
  if (!valeur) return null;
  const date = new Date(valeur);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Valide le formulaire. En modification, un début déjà passé peut rester tel
 * quel (US-15) : seul un nouveau début est contrôlé.
 */
export function validerFormulaire(
  f: FormulaireEvenement,
  maintenant: Date,
  debutActuel: string | null = null,
): Validation {
  const champs: ErreursChamps = {};
  const nom = f.nom.trim();
  const lieu = f.lieu.trim();
  const description = f.description.trim();
  const debut = instant(f.debut);
  const fin = instant(f.fin);

  if (!nom) champs.nom = "obligatoire";
  else if (nom.length < 3 || nom.length > 100)
    champs.nom = "longueurNomEvenement";

  if (!debut) champs.debut = "obligatoire";
  else {
    const inchange =
      debutActuel !== null &&
      debut.getTime() === new Date(debutActuel).getTime();
    if (!inchange && debut < maintenant) champs.debut = "debutPasse";
  }

  if (!lieu) champs.lieu = "obligatoire";
  else if (lieu.length > 150) champs.lieu = "max150";

  const categories = [...new Set(f.categories)].filter((c): c is Categorie =>
    (CATEGORIES as readonly string[]).includes(c),
  );
  if (categories.length === 0) champs.categories = "categorieRequise";

  if (description.length > 2000) champs.description = "max2000";
  if (f.fin && !fin) champs.fin = "dateInvalide";
  else if (fin && debut && fin <= debut) champs.fin = "finAvantDebut";

  if (Object.keys(champs).length || !debut) return { ok: false, champs };
  return {
    ok: true,
    donnees: {
      nom,
      debut: debut.toISOString(),
      fin: fin ? fin.toISOString() : null,
      lieu,
      categories,
      description: description || null,
    },
  };
}

// ——— Cycle de vie (US-15, D9) ———

export function estModifiable(evenement: Evenement, maintenant: Date): boolean {
  return (
    evenement.statut !== "annule" &&
    periodeDe(evenement, maintenant) !== "passe"
  );
}

/** Seuls le début, la fin et le lieu font passer au statut Modifié. */
export function changementsSuivis(
  avant: Evenement,
  apres: DonneesEvenement,
): Changement[] {
  const champs: ChampSuivi[] = ["debut", "fin", "lieu"];
  return champs
    .filter((champ) => (avant[champ] ?? null) !== (apres[champ] ?? null))
    .map((champ) => ({
      champ,
      avant: avant[champ] ?? null,
      apres: apres[champ] ?? null,
    }));
}

export const MOTIF_ANNULATION_MIN = 10;

// ——— Liste (US-16, US-17) ———

export type Filtres = {
  categories: Categorie[];
  periodes: Periode[];
  pages: string[];
};

export const FILTRES_PAR_DEFAUT: Filtres = {
  categories: [],
  periodes: ["en_cours", "a_venir"],
  pages: [],
};

/** OU dans un même filtre, ET entre filtres. */
export function correspond(
  evenement: Evenement,
  filtres: Filtres,
  maintenant: Date,
): boolean {
  const periodes = filtres.periodes.length
    ? filtres.periodes
    : FILTRES_PAR_DEFAUT.periodes;
  if (!periodes.includes(periodeDe(evenement, maintenant))) return false;
  if (
    filtres.categories.length &&
    !evenement.categories.some((c) => filtres.categories.includes(c))
  )
    return false;
  if (filtres.pages.length && !filtres.pages.includes(evenement.pageId))
    return false;
  return true;
}

/**
 * En cours et à venir : début croissant (les En cours arrivent donc en tête).
 * Passés : début décroissant, placés après. À début égal : ordre alphabétique.
 * Le statut ne change pas la position.
 */
export function trier(
  evenements: readonly Evenement[],
  maintenant: Date,
): Evenement[] {
  const rang = (e: Evenement) => (periodeDe(e, maintenant) === "passe" ? 1 : 0);
  return [...evenements].sort((a, b) => {
    const ra = rang(a);
    const rb = rang(b);
    if (ra !== rb) return ra - rb;
    const ecart = new Date(a.debut).getTime() - new Date(b.debut).getTime();
    if (ecart !== 0) return ra === 1 ? -ecart : ecart;
    return a.nom.localeCompare(b.nom, "fr");
  });
}

export const TAILLE_PAGE = 20;
