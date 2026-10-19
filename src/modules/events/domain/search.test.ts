import { describe, expect, it } from "vitest";
import { matchesSearch } from "@/modules/events/domain/search";

const texts = ["Soirée de gala", "Salle des fêtes", null, "BDE"];

describe("recherche d'événements", () => {
  it("ignore accents et casse, sur le nom, le lieu et la page", () => {
    expect(matchesSearch(texts, "SOIREE")).toBe(true);
    expect(matchesSearch(texts, "fetes")).toBe(true);
    expect(matchesSearch(texts, "bde")).toBe(true);
  });

  it("exige que chaque mot soit présent", () => {
    expect(matchesSearch(texts, "gala bde")).toBe(true);
    expect(matchesSearch(texts, "gala foot")).toBe(false);
  });

  it("une recherche vide correspond à tout", () => {
    expect(matchesSearch(texts, "   ")).toBe(true);
  });
});
