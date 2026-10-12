import { describe, expect, it } from "vitest";
import type { Evenement } from "../domain/evenement";
import { listerEvenements } from "./lister-evenements";

describe("listerEvenements", () => {
  it("lit la source et renvoie les événements triés par date", async () => {
    const source = async (): Promise<Evenement[]> => [
      { id: "2", titre: "Deux", date: new Date("2026-12-01"), lieu: "Kribi" },
      { id: "1", titre: "Un", date: new Date("2026-11-01"), lieu: "Buea" },
    ];

    const evenements = await listerEvenements(source);

    expect(evenements.map((e) => e.id)).toEqual(["1", "2"]);
  });
});
