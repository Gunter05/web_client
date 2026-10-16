import { describe, expect, it } from "vitest";
import { listerPages, type SourcesSupervision } from "./supervision";

const sources: SourcesSupervision = {
  comptes: () => [
    { id: "awa", nom: "Awa", email: "awa@x.cm", creeLe: "2026-01-01" },
  ],
  pages: () => [
    { id: "bde", slug: "bde", nom: "BDE", creeLe: "2026-02-01" },
    { id: "foot", slug: "foot", nom: "Club Foot", creeLe: "2026-03-01" },
  ],
  membres: () => [
    { pageId: "bde", compteId: "awa", role: "proprietaire", ajouteLe: "" },
    { pageId: "bde", compteId: "karim", role: "contributeur", ajouteLe: "" },
  ],
  evenements: () => [
    {
      id: "e",
      nom: "Gala",
      pageId: "bde",
      debut: "",
      statut: "annule",
      creeLe: "",
    },
  ],
};

describe("supervision des pages (US-07)", () => {
  it("de la plus récente à la plus ancienne, avec propriétaire et compteurs", () => {
    const { elements } = listerPages(sources, "", 1);
    expect(elements.map((p) => p.nom)).toEqual(["Club Foot", "BDE"]);
    expect(elements[1]).toMatchObject({
      proprietaire: "Awa",
      nbEvenements: 1,
      nbMembres: 2,
    });
  });

  it("recherche par nom", () => {
    expect(listerPages(sources, "foot", 1).elements).toHaveLength(1);
  });
});
