import { describe, expect, it } from "vitest";
import { readSearchParams } from "./search-params";

describe("lireRecherche", () => {
  it("lit la recherche et la page", () => {
    expect(readSearchParams({ q: "club", page: "3" })).toEqual({
      q: "club",
      page: 3,
    });
  });

  it("borne la recherche et retombe sur la première page", () => {
    expect(readSearchParams({ q: "x".repeat(150), page: "abc" })).toEqual({
      q: "x".repeat(100),
      page: 1,
    });
    expect(readSearchParams({ q: ["a", "b"] })).toEqual({ q: "", page: 1 });
  });
});
