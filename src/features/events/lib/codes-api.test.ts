import { describe, expect, it } from "vitest";
import { categorieVersApi, periodeVersApi, statutDepuisApi } from "./codes-api";

describe("codes du module events", () => {
  it("traduit les codes connus", () => {
    expect(categorieVersApi("vieEcole")).toBe("campusLife");
    expect(periodeVersApi("passe")).toBe("past");
    expect(statutDepuisApi("updated")).toBe("modifie");
  });

  it("laisse passer ou neutralise un code inconnu", () => {
    expect(categorieVersApi("inconnue")).toBe("inconnue");
    expect(periodeVersApi("demain")).toBe("demain");
    expect(statutDepuisApi("archive")).toBe("publie");
  });
});
