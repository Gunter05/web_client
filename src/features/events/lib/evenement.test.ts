import { describe, expect, it } from "vitest";
import {
  changementsSuivis,
  correspond,
  type Evenement,
  FILTRES_PAR_DEFAUT,
  periodeDe,
  trier,
  validerFormulaire,
} from "@/features/events/lib/evenement";
import {
  ecrireFiltresUrl,
  lireFiltresUrl,
} from "@/features/events/lib/filtres-url";

const maintenant = new Date("2026-10-16T12:00:00Z");

function ev(partiel: Partial<Evenement>): Evenement {
  return {
    id: "x",
    pageId: "p",
    nom: "Nom",
    debut: "2026-10-20T10:00:00Z",
    fin: null,
    lieu: "Amphi",
    categories: ["culture"],
    description: null,
    photo: null,
    statut: "publie",
    derniereModification: null,
    annulation: null,
    creeLe: "",
    ...partiel,
  };
}

describe("période (US-16, D5, D7)", () => {
  it("à venir avant le début", () => {
    expect(periodeDe(ev({}), maintenant)).toBe("a_venir");
  });

  it("sans fin, en cours jusqu'à 23h59 UTC le jour du début", () => {
    expect(periodeDe(ev({ debut: "2026-10-16T08:00:00Z" }), maintenant)).toBe(
      "en_cours",
    );
    expect(periodeDe(ev({ debut: "2026-10-15T08:00:00Z" }), maintenant)).toBe(
      "passe",
    );
  });

  it("en cours entre début et fin sur plusieurs jours", () => {
    expect(
      periodeDe(
        ev({ debut: "2026-10-14T08:00:00Z", fin: "2026-10-17T08:00:00Z" }),
        maintenant,
      ),
    ).toBe("en_cours");
  });
});

describe("tri (US-16)", () => {
  it("en cours en tête, à venir croissant, nom en départage, passés décroissants", () => {
    const liste = [
      ev({ id: "passe-ancien", debut: "2026-10-01T10:00:00Z" }),
      ev({ id: "b", nom: "B", debut: "2026-10-20T10:00:00Z" }),
      ev({ id: "a", nom: "A", debut: "2026-10-20T10:00:00Z" }),
      ev({ id: "passe-recent", debut: "2026-10-10T10:00:00Z" }),
      ev({ id: "en-cours", debut: "2026-10-16T09:00:00Z" }),
    ];
    expect(trier(liste, maintenant).map((e) => e.id)).toEqual([
      "en-cours",
      "a",
      "b",
      "passe-recent",
      "passe-ancien",
    ]);
  });

  it("le statut ne change pas la position", () => {
    const liste = [
      ev({ id: "annule", statut: "annule", debut: "2026-10-18T10:00:00Z" }),
      ev({ id: "publie", debut: "2026-10-19T10:00:00Z" }),
    ];
    expect(trier(liste, maintenant).map((e) => e.id)).toEqual([
      "annule",
      "publie",
    ]);
  });
});

describe("filtres (US-17)", () => {
  it("masque les passés par défaut", () => {
    expect(
      correspond(
        ev({ debut: "2026-10-01T10:00:00Z" }),
        FILTRES_PAR_DEFAUT,
        maintenant,
      ),
    ).toBe(false);
  });

  it("OU dans un filtre, ET entre filtres", () => {
    const filtres = {
      ...FILTRES_PAR_DEFAUT,
      categories: ["soiree" as const, "culture" as const],
    };
    expect(
      correspond(ev({}), { ...filtres, pages: ["autre"] }, maintenant),
    ).toBe(false);
    expect(correspond(ev({}), { ...filtres, pages: ["p"] }, maintenant)).toBe(
      true,
    );
  });

  it("se lisent et s'écrivent dans l'adresse", () => {
    const f = lireFiltresUrl({ categorie: "soiree,inconnue" });
    expect(f).toEqual({
      categories: ["soiree"],
      periodes: ["en_cours", "a_venir"],
      pages: [],
    });
    expect(ecrireFiltresUrl(f)).toBe("categorie=soiree");
    const url = "periode=passe&page=bde,club-foot";
    expect(ecrireFiltresUrl(lireFiltresUrl(new URLSearchParams(url)))).toBe(
      url,
    );
  });
});

describe("formulaire (US-11, US-15)", () => {
  const base = {
    nom: "Soirée",
    debut: "2026-10-20T18:00:00Z",
    fin: "",
    lieu: "Hall",
    categories: ["soiree"],
    description: "",
  };

  it("accepte un formulaire valide", () => {
    expect(validerFormulaire(base, maintenant).ok).toBe(true);
  });

  it("refuse un début passé à la création mais le garde en modification", () => {
    const passe = { ...base, debut: "2026-10-10T18:00:00Z" };
    const r = validerFormulaire(passe, maintenant);
    expect(!r.ok && r.champs.debut).toBe("debutPasse");
    expect(
      validerFormulaire(passe, maintenant, "2026-10-10T18:00:00.000Z").ok,
    ).toBe(true);
  });

  it("exige une fin après le début et au moins une catégorie", () => {
    const r = validerFormulaire(
      { ...base, fin: base.debut, categories: [] },
      maintenant,
    );
    expect(!r.ok && r.champs).toEqual({
      fin: "finAvantDebut",
      categories: "categorieRequise",
    });
  });
});

describe("changements suivis (US-15)", () => {
  it("seuls le début, la fin et le lieu comptent", () => {
    const avant = ev({});
    expect(
      changementsSuivis(avant, { ...avant, nom: "Autre", description: "x" }),
    ).toEqual([]);
    expect(changementsSuivis(avant, { ...avant, lieu: "Gymnase" })).toEqual([
      { champ: "lieu", avant: "Amphi", apres: "Gymnase" },
    ]);
  });
});
