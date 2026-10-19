import type {
  Categorie,
  ChampSuivi,
  Periode,
  Statut,
} from "../domain/evenement";

/**
 * Correspondance des codes entre le module `events` de l'API (anglais) et le
 * vocabulaire du front. Fichier pur, utilisable côté client comme serveur.
 */

/** Inverse une table de correspondance (front → API devient API → front). */
function inverser<A extends string, B extends string>(
  table: Record<A, B>,
): Record<B, A> {
  return Object.fromEntries(
    Object.entries(table).map(([a, b]) => [b, a]),
  ) as Record<B, A>;
}

const CATEGORIES: Record<Categorie, string> = {
  match: "match",
  interClubs: "interClub",
  integration: "orientation",
  soiree: "party",
  culture: "culture",
  conference: "conference",
  vieEcole: "campusLife",
  autre: "other",
};
const PERIODES: Record<Periode, string> = {
  en_cours: "ongoing",
  a_venir: "upcoming",
  passe: "past",
};
const STATUTS: Record<Statut, string> = {
  publie: "published",
  modifie: "updated",
  annule: "cancelled",
};
const CHAMPS_SUIVIS: Record<ChampSuivi, string> = {
  debut: "startsAt",
  fin: "endsAt",
  lieu: "location",
};
/** Champs du formulaire : noms de l'API → noms des champs du front. */
export const CHAMPS_FORMULAIRE: Record<string, string> = {
  name: "nom",
  startsAt: "debut",
  endsAt: "fin",
  location: "lieu",
  categories: "categories",
  description: "description",
  photoUrl: "photo",
  reason: "motif",
};
/** Codes d'erreur de l'API → clés `erreurs.*` du catalogue du front. */
export const ERREURS: Record<string, string> = {
  invalidInput: "formulaireInvalide",
  required: "obligatoire",
  nameLength: "longueurNomEvenement",
  startsInPast: "debutPasse",
  locationTooLong: "max150",
  categoryRequired: "categorieRequise",
  descriptionTooLong: "max2000",
  endsBeforeStart: "finAvantDebut",
  invalidPhoto: "formatImage",
  reasonTooShort: "motifCourt",
  eventNotFound: "evenementIntrouvable",
  pageNotFound: "pageIntrouvable",
  notAnOrganizerMember: "pasAutorisePublier",
  eventNotEditable: "evenementNonModifiable",
};

export const CATEGORIES_API = inverser(CATEGORIES);
export const PERIODES_API = inverser(PERIODES);
const STATUTS_API = inverser(STATUTS);
export const CHAMPS_SUIVIS_API = inverser(CHAMPS_SUIVIS);

/** Statut renvoyé par l'API (`published`…) dans le vocabulaire du front. */
export function statutDepuisApi(code: string): Statut {
  return STATUTS_API[code] ?? "publie";
}

export const categorieVersApi = (c: string) => CATEGORIES[c as Categorie] ?? c;
export const periodeVersApi = (p: string) => PERIODES[p as Periode] ?? p;
