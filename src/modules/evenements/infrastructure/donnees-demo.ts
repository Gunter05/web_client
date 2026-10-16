import type { Evenement } from "../domain/evenement";

/**
 * Événements de démonstration, générés relativement à la date du premier
 * lancement pour que la liste montre toujours des événements En cours, À venir,
 * Modifiés, Annulés et Passés.
 */
export function evenementsDemo(): Evenement[] {
  const maintenant = Date.now();
  const heure = 3_600_000;
  const jour = 24 * heure;
  const a = (ecart: number, heureUtc = 17) => {
    const d = new Date(maintenant + ecart);
    d.setUTCHours(heureUtc, 0, 0, 0);
    return d.toISOString();
  };
  const cree = new Date(maintenant - 10 * jour).toISOString();
  const base = (
    e: Partial<Evenement> &
      Pick<
        Evenement,
        "id" | "pageId" | "nom" | "debut" | "lieu" | "categories"
      >,
  ): Evenement => ({
    fin: null,
    description: null,
    photo: null,
    statut: "publie",
    derniereModification: null,
    annulation: null,
    creeLe: cree,
    journal: [{ action: "creation", compteId: "compte-awa", le: cree }],
    ...e,
  });
  const enCoursDebut = new Date(maintenant - 2 * heure).toISOString();
  const enCoursFin = new Date(maintenant + 3 * heure).toISOString();

  return [
    base({
      id: "integ2026",
      pageId: "page-bde",
      nom: "Journée d'intégration",
      debut: enCoursDebut,
      fin: enCoursFin,
      lieu: "Cour principale",
      categories: ["integration", "vieEcole"],
      photo: "/demo/integration.svg",
      description:
        "Jeux, stands des clubs et barbecue pour accueillir la nouvelle promo. Venez nombreux !",
    }),
    base({
      id: "derby4fc",
      pageId: "page-foot",
      nom: "Derby inter-écoles",
      debut: a(1 * jour, 15),
      lieu: "Stade municipal",
      categories: ["match", "interClubs"],
      photo: "/demo/foot-match.svg",
      description:
        "Notre équipe affronte l'école voisine. Supporters attendus en tenue aux couleurs du club.",
    }),
    base({
      id: "gala26xx",
      pageId: "page-bde",
      nom: "Soirée de gala",
      debut: a(3 * jour, 19),
      fin: a(4 * jour, 1),
      lieu: "Salle des fêtes",
      categories: ["soiree"],
      photo: "/demo/gala.svg",
      description:
        "Tenue de soirée exigée. Prévente des places au foyer du BDE.",
      statut: "modifie",
      derniereModification: {
        le: new Date(maintenant - jour).toISOString(),
        changements: [
          {
            champ: "lieu",
            avant: "Foyer des étudiants",
            apres: "Salle des fêtes",
          },
        ],
      },
    }),
    base({
      id: "moliere7",
      pageId: "page-theatre",
      nom: "Le Malade imaginaire",
      debut: a(5 * jour, 18),
      lieu: "Amphi A",
      categories: ["culture"],
      photo: "/demo/theatre-scene.svg",
      description:
        "Première représentation de l'année par la troupe Les Planches.",
    }),
    base({
      id: "ia4allx2",
      pageId: "page-ecole",
      nom: "Conférence : l'IA au quotidien",
      debut: a(6 * jour, 9),
      fin: a(6 * jour, 11),
      lieu: "Amphi B",
      categories: ["conference"],
      photo: "/demo/conference.svg",
    }),
    base({
      id: "tournoi8",
      pageId: "page-foot",
      nom: "Tournoi de futsal",
      debut: a(8 * jour, 14),
      lieu: "Gymnase",
      categories: ["match"],
      photo: null,
      statut: "annule",
      annulation: {
        motif: "Gymnase indisponible suite à des travaux.",
        le: new Date(maintenant - 2 * jour).toISOString(),
      },
    }),
    base({
      id: "inscrip9",
      pageId: "page-ecole",
      nom: "Clôture des inscriptions pédagogiques",
      debut: a(12 * jour, 8),
      lieu: "Service scolarité",
      categories: ["vieEcole"],
      photo: null,
    }),
    base({
      id: "impro123",
      pageId: "page-theatre",
      nom: "Atelier d'improvisation",
      debut: a(15 * jour, 17),
      lieu: "Salle 204",
      categories: ["culture", "conference"],
      photo: "/demo/impro.svg",
    }),
    base({
      id: "rentree1",
      pageId: "page-bde",
      nom: "Soirée de rentrée",
      debut: a(-9 * jour, 20),
      lieu: "Foyer des étudiants",
      categories: ["soiree", "integration"],
      photo: "/demo/rentree.svg",
    }),
    base({
      id: "amical01",
      pageId: "page-foot",
      nom: "Match amical",
      debut: a(-4 * jour, 15),
      lieu: "Stade municipal",
      categories: ["match"],
      photo: null,
    }),
  ];
}
