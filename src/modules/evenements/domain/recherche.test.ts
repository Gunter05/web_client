import { describe, expect, it } from "vitest";
import { correspondRecherche } from "./recherche";

const textes = ["Soirée de gala", "Salle des fêtes", null, "BDE"];

describe("recherche d'événements", () => {
  it("ignore accents et casse, sur le nom, le lieu et la page", () => {
    expect(correspondRecherche(textes, "SOIREE")).toBe(true);
    expect(correspondRecherche(textes, "fetes")).toBe(true);
    expect(correspondRecherche(textes, "bde")).toBe(true);
  });

  it("exige que chaque mot soit présent", () => {
    expect(correspondRecherche(textes, "gala bde")).toBe(true);
    expect(correspondRecherche(textes, "gala foot")).toBe(false);
  });

  it("une recherche vide correspond à tout", () => {
    expect(correspondRecherche(textes, "   ")).toBe(true);
  });
});
