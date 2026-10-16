import type { Compte } from "../domain/compte";
import { hacheurScrypt } from "./hacheur-scrypt";

/**
 * Comptes de démonstration. Mot de passe commun : voir README (« demo1234 »).
 * Les identifiants sont fixes car les autres modules les référencent dans
 * leurs propres données de démo.
 */
export const IDS_DEMO = {
  admin: "compte-admin",
  awa: "compte-awa",
  karim: "compte-karim",
  lina: "compte-lina",
} as const;

export function comptesDemo(): Compte[] {
  const hash = hacheurScrypt.hacher("demo1234");
  const le = "2026-09-01T08:00:00.000Z";
  return [
    {
      id: IDS_DEMO.admin,
      email: "admin@contineng.test",
      nom: "Équipe Contineng",
      photo: null,
      motDePasseHash: hash,
      estAdmin: true,
      creeLe: le,
    },
    {
      id: IDS_DEMO.awa,
      email: "awa@contineng.test",
      nom: "Awa Ndiaye",
      photo: null,
      motDePasseHash: hash,
      estAdmin: false,
      creeLe: le,
    },
    {
      id: IDS_DEMO.karim,
      email: "karim@contineng.test",
      nom: "Karim Mbarga",
      photo: null,
      motDePasseHash: hash,
      estAdmin: false,
      creeLe: le,
    },
    {
      id: IDS_DEMO.lina,
      email: "lina@contineng.test",
      nom: "Lina Fotso",
      photo: null,
      motDePasseHash: hash,
      estAdmin: false,
      creeLe: le,
    },
  ];
}
