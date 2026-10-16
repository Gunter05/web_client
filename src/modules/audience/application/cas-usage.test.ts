import { beforeEach, describe, expect, it } from "vitest";
import type { Vue } from "../domain/vue";
import * as cas from "./cas-usage";

let deps: cas.DepsAudience;
let jour: string;
const navigateur = "Mozilla/5.0 (Android 14) Chrome/130";

beforeEach(() => {
  const vues: Vue[] = [];
  jour = "2026-10-16T10:00:00Z";
  deps = {
    vues: { toutes: () => vues, ajouter: (v) => void vues.push(v) },
    horloge: { maintenant: () => new Date(jour) },
  };
});

const ouverture = (visiteurId: string, extra: Partial<cas.Ouverture> = {}) =>
  cas.enregistrerOuverture(deps, {
    evenementId: "e1",
    visiteurId,
    userAgent: navigateur,
    estMembreOrganisateur: false,
    ...extra,
  });

describe("nombre de vues (US-39)", () => {
  it("compte les visiteurs uniques par jour, sans robots ni membres", () => {
    expect(ouverture("v1")).toBe(true);
    expect(ouverture("v1")).toBe(false);
    expect(ouverture("v2")).toBe(true);
    expect(ouverture("robot", { userAgent: "WhatsApp/2.0" })).toBe(false);
    expect(ouverture("membre", { estMembreOrganisateur: true })).toBe(false);
    jour = "2026-10-17T09:00:00Z";
    expect(ouverture("v1")).toBe(true);
    expect(cas.compterVues(deps, ["e1", "e2"])).toEqual(
      new Map([
        ["e1", 3],
        ["e2", 0],
      ]),
    );
  });
});
