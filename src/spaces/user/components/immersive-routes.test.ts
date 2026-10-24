import { describe, expect, it } from "vitest";
import { isImmersive } from "@/spaces/user/components/immersive-routes";

describe("isImmersive", () => {
  it("met la fiche d'un événement en plein écran", () => {
    expect(isImmersive("/e/gala26xx")).toBe(true);
  });

  it("garde la navigation partout ailleurs, y compris la modification", () => {
    expect(isImmersive("/")).toBe(false);
    expect(isImmersive("/e/gala26xx/edit")).toBe(false);
    expect(isImmersive("/events/new")).toBe(false);
  });
});
