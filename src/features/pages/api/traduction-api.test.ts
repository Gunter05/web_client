import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/shared/config/env", () => ({ env: { API_URL: "http://api" } }));

const { ErreurApi } = await import("@/shared/api/client");
const { traduireErreur, versDemande, versMembre, versPage } =
  await import("@/features/pages/api/traduction-api");
const { typeVersApi } = await import("@/features/pages/lib/codes-api");

describe("traduction du contrat pages", () => {
  it("convertit une page, un membre et une demande", () => {
    expect(
      versPage({
        id: "p1",
        slug: "bde",
        name: "BDE",
        description: "Vie étudiante",
        type: "studentUnion",
        photoUrl: null,
        createdAt: "2026-10-01T00:00:00Z",
      }),
    ).toMatchObject({
      nom: "BDE",
      type: "bde",
      creeLe: "2026-10-01T00:00:00Z",
    });
    expect(
      versMembre({
        accountId: "a1",
        name: "Awa",
        photoUrl: null,
        role: "owner",
        addedAt: "2026-10-01T00:00:00Z",
      }),
    ).toMatchObject({ compteId: "a1", role: "proprietaire" });
    expect(
      versDemande({
        id: "d1",
        name: "Club Robotique",
        description: "Robots",
        type: "schoolService",
        photoUrl: null,
        justification: "15 membres",
        status: "rejected",
        rejectionReason: "Doublon",
        submittedAt: "2026-10-01T00:00:00Z",
        requester: { id: "l1", name: "Lina", photoUrl: null },
      }),
    ).toMatchObject({
      type: "service",
      statut: "refusee",
      motifRefus: "Doublon",
      demandeur: { nom: "Lina" },
    });
    expect(typeVersApi("bde")).toBe("studentUnion");
  });

  it("traduit les erreurs et les noms de champs", () => {
    expect(
      traduireErreur(new ErreurApi(400, "invalidInput", { name: "nameTaken" })),
    ).toMatchObject({
      code: "formulaireInvalide",
      champs: { nom: "nomDejaUtilise" },
    });
    expect(traduireErreur(new ErreurApi(409, "alreadyMember"))).toMatchObject({
      code: "dejaMembre",
    });
  });
});
