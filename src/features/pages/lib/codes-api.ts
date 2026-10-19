import type {
  Role,
  StatutDemande,
  TypeOrganisation,
} from "@/features/pages/types/page.types";

/**
 * Correspondance des codes entre le module `pages` de l'API (anglais) et le
 * vocabulaire du front. Fichier pur, utilisable côté client comme serveur.
 */

function inverser<A extends string, B extends string>(
  table: Record<A, B>,
): Record<B, A> {
  return Object.fromEntries(
    Object.entries(table).map(([a, b]) => [b, a]),
  ) as Record<B, A>;
}

const TYPES: Record<TypeOrganisation, string> = {
  club: "club",
  association: "association",
  bde: "studentUnion",
  service: "schoolService",
  autre: "other",
};
const ROLES: Record<Role, string> = {
  proprietaire: "owner",
  contributeur: "contributor",
};
const STATUTS: Record<StatutDemande, string> = {
  en_attente: "pending",
  acceptee: "accepted",
  refusee: "rejected",
  retiree: "withdrawn",
};

/** Champs des formulaires : noms de l'API → noms des champs du front. */
export const CHAMPS_FORMULAIRE: Record<string, string> = {
  name: "nom",
  description: "description",
  type: "type",
  justification: "justification",
  photoUrl: "photo",
  reason: "motif",
  accountId: "compteId",
};

/** Codes d'erreur de l'API → clés `erreurs.*` du catalogue du front. */
export const ERREURS: Record<string, string> = {
  invalidInput: "formulaireInvalide",
  required: "obligatoire",
  nameLength: "longueurNomPage",
  nameTaken: "nomDejaUtilise",
  descriptionTooLong: "max500",
  justificationTooLong: "max500",
  invalidPhoto: "formatImage",
  reasonTooShort: "motifCourt",
  pendingRequestExists: "demandeDejaEnAttente",
  requestAlreadyReviewed: "demandeDejaTraitee",
  pageRequestNotFound: "introuvable",
  pageNotFound: "pageIntrouvable",
  accessDenied: "accesRefuse",
  alreadyMember: "dejaMembre",
  memberNotFound: "introuvable",
  accountNotFound: "introuvable",
};

const TYPES_API = inverser(TYPES);
const ROLES_API = inverser(ROLES);
const STATUTS_API = inverser(STATUTS);

/** Type d'organisation renvoyé par l'API (`studentUnion`…) côté front. */
export const typeDepuisApi = (code: string): TypeOrganisation =>
  TYPES_API[code] ?? "autre";
/** Rôle renvoyé par l'API (`owner`…) côté front. */
export const roleDepuisApi = (code: string): Role =>
  ROLES_API[code] ?? "contributeur";
export const statutDepuisApi = (code: string): StatutDemande =>
  STATUTS_API[code] ?? "en_attente";
export const typeVersApi = (type: string) =>
  TYPES[type as TypeOrganisation] ?? type;
