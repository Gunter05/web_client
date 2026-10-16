import { describe, expect, it } from "vitest";
import { dejaVue, estUnRobot } from "./vue";

describe("vues (US-39)", () => {
  it("reconnaît les robots d'aperçu", () => {
    expect(estUnRobot("WhatsApp/2.23.20.0")).toBe(true);
    expect(estUnRobot("facebookexternalhit/1.1")).toBe(true);
    expect(estUnRobot(null)).toBe(true);
    expect(
      estUnRobot("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Safari/604.1"),
    ).toBe(false);
  });

  it("compte une seule vue par visiteur, par événement et par jour UTC", () => {
    const vue = { evenementId: "e", visiteurId: "v", jour: "2026-10-16" };
    expect(dejaVue([vue], { ...vue })).toBe(true);
    expect(dejaVue([vue], { ...vue, jour: "2026-10-17" })).toBe(false);
  });
});
