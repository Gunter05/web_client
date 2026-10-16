import { describe, expect, it } from "vitest";
import { cleDeNom, erreursDemande, trierMembres } from "./page";

describe("formulaire de demande (US-03)", () => {
  it("signale chaque champ en erreur", () => {
    expect(
      erreursDemande({
        nom: "AB",
        description: "",
        type: "secte",
        justification: "x".repeat(501),
      }),
    ).toEqual({
      nom: "longueurNomPage",
      description: "obligatoire",
      type: "obligatoire",
      justification: "max500",
    });
  });

  it("compare les noms sans casse ni accents", () => {
    expect(cleDeNom("  Club  Échecs ")).toBe(cleDeNom("club echecs"));
  });
});

describe("trierMembres (US-06)", () => {
  it("met le propriétaire en tête, puis les contributeurs du plus récent au plus ancien", () => {
    const tries = trierMembres([
      {
        pageId: "p",
        compteId: "ancien",
        role: "contributeur",
        ajouteLe: "2026-01-01",
      },
      {
        pageId: "p",
        compteId: "proprio",
        role: "proprietaire",
        ajouteLe: "2025-01-01",
      },
      {
        pageId: "p",
        compteId: "recent",
        role: "contributeur",
        ajouteLe: "2026-06-01",
      },
    ]);
    expect(tries.map((m) => m.compteId)).toEqual([
      "proprio",
      "recent",
      "ancien",
    ]);
  });
});
