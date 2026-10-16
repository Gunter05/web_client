import { describe, expect, it } from "vitest";
import { notificationsPour } from "./notification";

describe("notifications (US-03, US-06)", () => {
  it("prévient chaque admin d'une nouvelle demande", () => {
    const n = notificationsPour(
      { type: "demandeDeposee", demandeId: "d1", nomPage: "Club" },
      ["a1", "a2"],
    );
    expect(n.map((x) => x.destinataireId)).toEqual(["a1", "a2"]);
    expect(n[0]?.lien).toBe("/admin/demandes/d1");
  });

  it("prévient le demandeur d'un refus avec son motif", () => {
    const [n] = notificationsPour(
      {
        type: "demandeRefusee",
        nomPage: "Club",
        demandeurId: "u",
        motif: "Doublon du BDE",
      },
      [],
    );
    expect(n).toMatchObject({
      destinataireId: "u",
      type: "demandeRefusee",
      params: { motif: "Doublon du BDE" },
    });
  });

  it("prévient la personne qui reçoit ou perd l'accès à une page", () => {
    expect(
      notificationsPour(
        { type: "accesDonne", nomPage: "BDE", compteId: "k" },
        [],
      )[0]?.type,
    ).toBe("accesDonne");
    expect(
      notificationsPour(
        { type: "accesRetire", nomPage: "BDE", compteId: "k" },
        [],
      )[0]?.type,
    ).toBe("accesRetire");
  });
});
