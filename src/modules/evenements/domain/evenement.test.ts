import { describe, expect, it } from "vitest";
import { type Evenement, trierParDate } from "./evenement";

const evenement = (id: string, date: string): Evenement => ({
  id,
  titre: `Événement ${id}`,
  date: new Date(date),
  lieu: "Douala",
});

describe("trierParDate", () => {
  it("range les événements du plus proche au plus lointain", () => {
    const tries = trierParDate([
      evenement("b", "2026-12-01T10:00:00Z"),
      evenement("a", "2026-11-01T10:00:00Z"),
    ]);

    expect(tries.map((e) => e.id)).toEqual(["a", "b"]);
  });

  it("ne modifie pas la liste reçue", () => {
    const liste = [
      evenement("b", "2026-12-01T10:00:00Z"),
      evenement("a", "2026-11-01T10:00:00Z"),
    ];

    trierParDate(liste);

    expect(liste.map((e) => e.id)).toEqual(["b", "a"]);
  });
});
