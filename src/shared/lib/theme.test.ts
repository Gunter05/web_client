import { describe, expect, it } from "vitest";
import { isTheme, resolveTheme } from "./theme";

describe("resolveTheme", () => {
  it("suit l'appareil pour « system »", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });

  it("impose le choix sinon", () => {
    expect(resolveTheme("dark", false)).toBe("dark");
    expect(resolveTheme("light", true)).toBe("light");
  });
});

describe("isTheme", () => {
  it("refuse une valeur inconnue (stockage modifié à la main)", () => {
    expect(isTheme("dark")).toBe(true);
    expect(isTheme("sepia")).toBe(false);
    expect(isTheme(null)).toBe(false);
  });
});
