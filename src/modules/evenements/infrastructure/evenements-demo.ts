import type { Evenement } from "../domain/evenement";

const evenements: Evenement[] = [
  {
    id: "2",
    titre: "Concert au parc",
    date: new Date("2026-11-21T20:00:00"),
    lieu: "Douala",
  },
  {
    id: "1",
    titre: "Rencontre des développeurs",
    date: new Date("2026-11-07T18:30:00"),
    lieu: "Yaoundé",
  },
];

export async function lireEvenementsDemo(): Promise<Evenement[]> {
  return evenements;
}
