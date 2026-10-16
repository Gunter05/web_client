import { describe, expect, it } from "vitest";
import { contient, paginer, TAILLE_PAGE_ADMIN } from "./pagination";

describe("pagination de l'administration (US-07)", () => {
  const elements = Array.from({ length: 60 }, (_, i) => i);

  it("découpe par 25 et borne la page demandée", () => {
    expect(TAILLE_PAGE_ADMIN).toBe(25);
    expect(paginer(elements, 1).elements).toHaveLength(25);
    expect(paginer(elements, 3)).toMatchObject({
      page: 3,
      totalPages: 3,
      total: 60,
    });
    expect(paginer(elements, 99).page).toBe(3);
    expect(paginer([], 1)).toMatchObject({ page: 1, totalPages: 1 });
  });

  it("cherche sans tenir compte de la casse", () => {
    expect(contient("Awa Ndiaye", "  ndi")).toBe(true);
  });
});
