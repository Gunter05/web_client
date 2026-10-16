import { beforeEach, describe, expect, it } from "vitest";
import type { DemandePage, Membre, Page } from "../domain/page";
import * as cas from "./cas-usage";

let deps: cas.DepsPages;

beforeEach(() => {
  const pages: Page[] = [];
  const membres: Membre[] = [];
  const demandes: DemandePage[] = [];
  deps = {
    pages: { toutes: () => pages, ajouter: (p) => void pages.push(p) },
    membres: {
      tous: () => membres,
      ajouter: (m) => void membres.push(m),
      retirer: (pageId, compteId) => {
        const i = membres.findIndex(
          (m) => m.pageId === pageId && m.compteId === compteId,
        );
        if (i >= 0) membres.splice(i, 1);
      },
    },
    demandes: {
      toutes: () => demandes,
      ajouter: (d) => void demandes.push(d),
      modifier: (d) =>
        void demandes.splice(
          demandes.findIndex((x) => x.id === d.id),
          1,
          d,
        ),
    },
    horloge: { maintenant: () => new Date("2026-10-16T10:00:00Z") },
  };
});

const formulaire = {
  nom: "Club Échecs",
  description: "Parties le jeudi.",
  type: "club",
  justification: "20 membres.",
};
const admin = { compteId: "admin", estAdmin: true };

function pageAcceptee(proprietaire: string) {
  const demande = cas.deposerDemande(deps, proprietaire, formulaire, null);
  if (!demande.ok) throw new Error(demande.code);
  const acceptee = cas.accepterDemande(deps, admin, demande.valeur.id);
  if (!acceptee.ok) throw new Error(acceptee.code);
  return acceptee.valeur.page;
}

describe("demande de page (US-03)", () => {
  it("acceptée : la page est créée et le demandeur en est propriétaire", () => {
    const page = pageAcceptee("u1");
    expect(page.slug).toBe("club-echecs");
    expect(cas.roleDe(deps, page.id, "u1")).toBe("proprietaire");
    expect(cas.pagesDuMembre(deps, "u1").map((p) => p.id)).toEqual([page.id]);
  });

  it("refuse un nom déjà pris sans tenir compte de la casse ni des accents", () => {
    expect(cas.deposerDemande(deps, "u1", formulaire, null).ok).toBe(true);
    const r = cas.deposerDemande(
      deps,
      "u2",
      { ...formulaire, nom: "club echecs", type: "" },
      null,
    );
    expect(!r.ok && r.champs).toEqual({
      nom: "nomDejaUtilise",
      type: "obligatoire",
    });
  });

  it("une seule demande en attente ; une nouvelle est possible après un refus", () => {
    const d = cas.deposerDemande(deps, "u1", formulaire, null);
    if (!d.ok) throw new Error();
    const deuxieme = cas.deposerDemande(
      deps,
      "u1",
      { ...formulaire, nom: "Autre" },
      null,
    );
    expect(!deuxieme.ok && deuxieme.code).toBe("demandeDejaEnAttente");
    const refusCourt = cas.refuserDemande(deps, admin, d.valeur.id, "court");
    expect(!refusCourt.ok && refusCourt.champs?.motif).toBe("motifCourt");
    expect(
      cas.refuserDemande(deps, admin, d.valeur.id, "Doublon du club existant")
        .ok,
    ).toBe(true);
    expect(cas.deposerDemande(deps, "u1", formulaire, null).ok).toBe(true);
  });

  it("se retire tant qu'elle n'est pas traitée", () => {
    const d = cas.deposerDemande(deps, "u1", formulaire, null);
    if (!d.ok) throw new Error();
    expect(cas.retirerDemande(deps, "u2", d.valeur.id).ok).toBe(false);
    expect(cas.retirerDemande(deps, "u1", d.valeur.id).ok).toBe(true);
    expect(cas.demandeEnAttenteDe(deps, "u1")).toBeNull();
  });

  it("réserve la décision aux admins", () => {
    const d = cas.deposerDemande(deps, "u1", formulaire, null);
    if (!d.ok) throw new Error();
    const r = cas.accepterDemande(
      deps,
      { compteId: "u2", estAdmin: false },
      d.valeur.id,
    );
    expect(!r.ok && r.code).toBe("accesRefuse");
  });
});

describe("accès à une page (US-06)", () => {
  it("seul le propriétaire donne ou retire l'accès, sans doublon", () => {
    const { id } = pageAcceptee("proprio");
    expect(cas.donnerAcces(deps, "proprio", id, "contrib").ok).toBe(true);
    expect(cas.donnerAcces(deps, "proprio", id, "contrib").ok).toBe(false);
    expect(cas.donnerAcces(deps, "proprio", id, "proprio").ok).toBe(false);
    expect(cas.donnerAcces(deps, "contrib", id, "autre").ok).toBe(false);
    expect(cas.retirerAcces(deps, "proprio", id, "proprio").ok).toBe(false);
    expect(cas.retirerAcces(deps, "proprio", id, "contrib").ok).toBe(true);
    expect(cas.roleDe(deps, id, "contrib")).toBeNull();
  });
});

describe("lectures (US-03, US-06)", () => {
  it("liste les membres, la dernière demande et les demandes en attente", () => {
    const { id } = pageAcceptee("proprio");
    cas.donnerAcces(deps, "proprio", id, "contrib");
    expect(cas.membresDe(deps, id).map((m) => m.role)).toEqual([
      "proprietaire",
      "contributeur",
    ]);
    expect(cas.derniereDemandeDe(deps, "proprio")?.statut).toBe("acceptee");
    expect(cas.derniereDemandeDe(deps, "personne")).toBeNull();
    cas.deposerDemande(deps, "u9", { ...formulaire, nom: "Autre club" }, null);
    expect(cas.demandesEnAttente(deps).map((d) => d.nom)).toEqual([
      "Autre club",
    ]);
  });

  it("refuse une décision sur une demande inconnue ou déjà traitée", () => {
    expect(cas.accepterDemande(deps, admin, "inconnue").ok).toBe(false);
    const d = cas.deposerDemande(deps, "u1", formulaire, null);
    if (!d.ok) throw new Error();
    cas.accepterDemande(deps, admin, d.valeur.id);
    const r = cas.refuserDemande(deps, admin, d.valeur.id, "Motif suffisant");
    expect(!r.ok && r.code).toBe("demandeDejaTraitee");
    expect(cas.retirerDemande(deps, "u1", d.valeur.id).ok).toBe(false);
  });
});
