import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/shared/config/env", () => ({ env: { API_URL: "http://api" } }));

const { ErreurApi } = await import("@/shared/api/client");
const { traduireErreur, versEvenementAffiche } =
  await import("./traduction-api");
const { categorieVersApi, periodeVersApi, statutDepuisApi } =
  await import("./codes-api");

describe("traduction du contrat events", () => {
  it("convertit un événement de l'API dans le vocabulaire du front", () => {
    const e = versEvenementAffiche({
      id: "gala26xx",
      organizerPageId: "p1",
      name: "Gala",
      startsAt: "2026-10-20T18:00:00Z",
      endsAt: null,
      location: "Salle",
      categories: ["party", "campusLife", "inconnue"],
      description: null,
      photoUrl: null,
      status: "updated",
      period: "upcoming",
      latestUpdate: {
        at: "2026-10-18T10:00:00Z",
        changes: [{ field: "location", before: "Foyer", after: "Salle" }],
      },
      cancellation: null,
      createdAt: "2026-10-10T10:00:00Z",
      organizer: { id: "p1", slug: "bde", name: "BDE", photoUrl: null },
    });
    expect(e).toMatchObject({
      nom: "Gala",
      lieu: "Salle",
      categories: ["soiree", "vieEcole"],
      statut: "modifie",
      periode: "a_venir",
      derniereModification: {
        changements: [{ champ: "lieu", avant: "Foyer", apres: "Salle" }],
      },
      page: { slug: "bde", nom: "BDE" },
    });
  });

  it("traduit les codes dans les deux sens", () => {
    expect(categorieVersApi("interClubs")).toBe("interClub");
    expect(periodeVersApi("en_cours")).toBe("ongoing");
    expect(statutDepuisApi("cancelled")).toBe("annule");
  });

  it("traduit les erreurs et les noms de champs", () => {
    const traduite = traduireErreur(
      new ErreurApi(400, "invalidInput", {
        name: "nameLength",
        reason: "reasonTooShort",
      }),
    );
    expect(traduite).toMatchObject({
      code: "formulaireInvalide",
      champs: { nom: "longueurNomEvenement", motif: "motifCourt" },
    });
    const autre = new Error("réseau");
    expect(traduireErreur(autre)).toBe(autre);
  });
});
