import { describe, expect, it } from "vitest";
import { lireRecherche } from "./recherche";

describe("lireRecherche", () => {
  it("lit la recherche et la page", () => {
    expect(lireRecherche({ q: "club", page: "3" })).toEqual({
      q: "club",
      page: 3,
    });
  });

  it("borne la recherche et retombe sur la première page", () => {
    expect(lireRecherche({ q: "x".repeat(150), page: "abc" })).toEqual({
      q: "x".repeat(100),
      page: 1,
    });
    expect(lireRecherche({ q: ["a", "b"] })).toEqual({ q: "", page: 1 });
  });
});
