import { beforeEach, describe, expect, it } from "vitest";
import type { Evenement } from "../domain/evenement";
import * as cas from "./cas-usage";

let deps: cas.DepsEvenements;
let maintenant: Date;
const membres = new Set(["page-a:awa", "page-a:karim", "page-b:lina"]);
const autorise = (pageId: string, compteId: string) =>
  membres.has(`${pageId}:${compteId}`);

beforeEach(() => {
  const evenements: Evenement[] = [];
  maintenant = new Date("2026-10-16T10:00:00Z");
  deps = {
    evenements: {
      tous: () => evenements,
      ajouter: (e) => void evenements.push(e),
      modifier: (e) =>
        void evenements.splice(
          evenements.findIndex((x) => x.id === e.id),
          1,
          e,
        ),
    },
    horloge: { maintenant: () => maintenant },
  };
});

const formulaire = {
  nom: "Soirée",
  debut: "2026-10-20T18:00:00Z",
  fin: "",
  lieu: "Foyer",
  categories: ["soiree"],
  description: "",
};
const awa = { compteId: "awa", pageId: "page-a" };

function creer() {
  const r = cas.creer(deps, awa, autorise, formulaire, null);
  if (!r.ok) throw new Error(r.code);
  return r.valeur;
}

describe("droits de publication (US-11, US-06, US-37)", () => {
  it("refuse sans page active, ou sur une page dont on n'est pas membre", () => {
    const sansPage = cas.creer(
      deps,
      { compteId: "awa", pageId: null },
      autorise,
      formulaire,
      null,
    );
    expect(!sansPage.ok && sansPage.code).toBe("choisirPage");
    const intrus = cas.creer(
      deps,
      { compteId: "awa", pageId: "page-b" },
      autorise,
      formulaire,
      null,
    );
    expect(!intrus.ok && intrus.code).toBe("pasAutorisePublier");
  });

  it("publie immédiatement au statut Publié, au nom de la page active", () => {
    const e = creer();
    expect(e.statut).toBe("publie");
    expect(e.pageId).toBe("page-a");
    expect(e.journal[0]?.compteId).toBe("awa");
  });

  it("un contributeur modifie l'événement d'un autre membre ; un étranger, non", () => {
    const { id } = creer();
    const karim = { compteId: "karim", pageId: "page-a" };
    expect(
      cas.modifier(
        deps,
        karim,
        autorise,
        id,
        { ...formulaire, nom: "Grande soirée" },
        undefined,
      ).ok,
    ).toBe(true);
    const lina = { compteId: "lina", pageId: "page-b" };
    expect(
      cas.modifier(deps, lina, autorise, id, formulaire, undefined).ok,
    ).toBe(false);
  });
});

describe("cycle de vie (US-15, D9)", () => {
  it("passe en Modifié seulement si le début, la fin ou le lieu change", () => {
    const { id } = creer();
    const nom = cas.modifier(
      deps,
      awa,
      autorise,
      id,
      { ...formulaire, nom: "Autre nom" },
      undefined,
    );
    expect(nom.ok && nom.valeur.statut).toBe("publie");
    const lieu = cas.modifier(
      deps,
      awa,
      autorise,
      id,
      { ...formulaire, lieu: "Gymnase" },
      undefined,
    );
    expect(lieu.ok && lieu.valeur.derniereModification?.changements).toEqual([
      { champ: "lieu", avant: "Foyer", apres: "Gymnase" },
    ]);
  });

  it("garde un début déjà passé tel quel en modification", () => {
    const enCours = {
      ...formulaire,
      debut: "2026-10-16T09:00:00Z",
      fin: "2026-10-16T20:00:00Z",
    };
    expect(cas.creer(deps, awa, autorise, enCours, null).ok).toBe(false);
    maintenant = new Date("2026-10-16T08:00:00Z");
    const cree = cas.creer(deps, awa, autorise, enCours, null);
    if (!cree.ok) throw new Error();
    maintenant = new Date("2026-10-16T10:00:00Z");
    expect(
      cas.modifier(deps, awa, autorise, cree.valeur.id, enCours, undefined).ok,
    ).toBe(true);
  });

  it("l'annulation exige un motif, est définitive et bloque toute modification", () => {
    const { id } = creer();
    expect(cas.annuler(deps, awa, autorise, id, "pluie").ok).toBe(false);
    expect(
      cas.annuler(deps, awa, autorise, id, "Pluie toute la journée").ok,
    ).toBe(true);
    const apres = cas.modifier(deps, awa, autorise, id, formulaire, undefined);
    expect(!apres.ok && apres.code).toBe("evenementNonModifiable");
  });
});

describe("liste paginée (US-16)", () => {
  it("charge 20 événements, puis la suite", () => {
    for (let i = 0; i < 25; i++) {
      cas.creer(
        deps,
        awa,
        autorise,
        { ...formulaire, nom: `Événement ${i}` },
        null,
      );
    }
    const filtres = {
      categories: [],
      periodes: ["en_cours" as const, "a_venir" as const],
      pages: [],
    };
    const premiere = cas.lister(deps, filtres);
    expect(premiere.evenements).toHaveLength(20);
    expect(premiere.suivant).toBe(20);
    const suite = cas.lister(deps, filtres, 20);
    expect(suite.evenements).toHaveLength(5);
    expect(suite.suivant).toBeNull();
  });
});
