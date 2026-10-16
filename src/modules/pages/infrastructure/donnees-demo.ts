import type { DemandePage, Membre, Page } from "../domain/page";

/** Identifiants fixes, référencés par les données de démo du module evenements. */
export const PAGES_DEMO = {
  bde: "page-bde",
  foot: "page-foot",
  theatre: "page-theatre",
  ecole: "page-ecole",
} as const;

const le = "2026-09-05T08:00:00.000Z";

export const pagesDemo = (): Page[] => [
  {
    id: PAGES_DEMO.bde,
    slug: "bde",
    nom: "BDE",
    description:
      "Le bureau des étudiants : intégration, soirées et vie de campus.",
    type: "bde",
    photo: "/demo/bde.svg",
    creeLe: le,
  },
  {
    id: PAGES_DEMO.foot,
    slug: "club-foot",
    nom: "Club Foot",
    description: "Entraînements le mardi, matchs inter-écoles le week-end.",
    type: "club",
    photo: "/demo/foot.svg",
    creeLe: le,
  },
  {
    id: PAGES_DEMO.theatre,
    slug: "les-planches",
    nom: "Les Planches",
    description: "Troupe de théâtre de l'école. Débutants bienvenus.",
    type: "association",
    photo: "/demo/theatre.svg",
    creeLe: le,
  },
  {
    id: PAGES_DEMO.ecole,
    slug: "scolarite",
    nom: "Scolarité",
    description: "Informations officielles du service scolarité.",
    type: "service",
    photo: "/demo/ecole.svg",
    creeLe: le,
  },
];

export const membresDemo = (): Membre[] => [
  {
    pageId: PAGES_DEMO.bde,
    compteId: "compte-awa",
    role: "proprietaire",
    ajouteLe: le,
  },
  {
    pageId: PAGES_DEMO.bde,
    compteId: "compte-karim",
    role: "contributeur",
    ajouteLe: "2026-09-10T08:00:00.000Z",
  },
  {
    pageId: PAGES_DEMO.foot,
    compteId: "compte-karim",
    role: "proprietaire",
    ajouteLe: le,
  },
  {
    pageId: PAGES_DEMO.theatre,
    compteId: "compte-awa",
    role: "proprietaire",
    ajouteLe: le,
  },
  {
    pageId: PAGES_DEMO.ecole,
    compteId: "compte-admin",
    role: "proprietaire",
    ajouteLe: le,
  },
];

export const demandesDemo = (): DemandePage[] => [
  {
    id: "demande-robotique",
    demandeurId: "compte-lina",
    nom: "Club Robotique",
    description: "Construire des robots et participer à la coupe de robotique.",
    type: "club",
    photo: null,
    justification:
      "Nous sommes 15 membres actifs et l'école soutient le projet.",
    statut: "en_attente",
    motifRefus: null,
    envoyeeLe: "2026-10-14T09:30:00.000Z",
    traiteeLe: null,
    traiteePar: null,
    pageId: null,
  },
];
