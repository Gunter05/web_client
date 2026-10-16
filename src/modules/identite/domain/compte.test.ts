import { describe, expect, it } from "vitest";
import { erreursInscription, normaliserEmail } from "./compte";

describe("inscription", () => {
  it("accepte des données valides", () => {
    expect(
      erreursInscription({
        nom: "Awa",
        email: "awa@ecole.cm",
        motDePasse: "12345678",
      }),
    ).toEqual({});
  });

  it("signale chaque champ en erreur", () => {
    expect(
      erreursInscription({ nom: "", email: "x", motDePasse: "court" }),
    ).toEqual({
      nom: "obligatoire",
      email: "emailInvalide",
      motDePasse: "motDePasseCourt",
    });
  });

  it("normalise l'e-mail", () => {
    expect(normaliserEmail("  Awa@Ecole.CM ")).toBe("awa@ecole.cm");
  });
});
