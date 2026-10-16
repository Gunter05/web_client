import { describe, expect, it } from "vitest";
import { peutActiver, type ProfilPage, resoudreProfilActif } from "./profil";

const bde: ProfilPage = {
  type: "page",
  id: "bde",
  nom: "BDE",
  photo: null,
  slug: "bde",
  role: "proprietaire",
};
const compte = { id: "awa", nom: "Awa", photo: null, estAdmin: false };
const nomDePage = () => "BDE";

describe("profil actif (US-37)", () => {
  it("liste le profil personnel puis les pages du membre", () => {
    const { etat } = resoudreProfilActif({
      compte,
      pageActiveId: null,
      pagesDuMembre: [bde],
      nomDePage,
    });
    expect(etat.actif.type).toBe("personnel");
    expect(etat.profils.map((p) => p.id)).toEqual(["awa", "bde"]);
  });

  it("active la page choisie", () => {
    const { etat } = resoudreProfilActif({
      compte,
      pageActiveId: "bde",
      pagesDuMembre: [bde],
      nomDePage,
    });
    expect(etat.actif).toEqual(bde);
  });

  it("revient au profil personnel quand l'accès a été retiré", () => {
    const r = resoudreProfilActif({
      compte,
      pageActiveId: "bde",
      pagesDuMembre: [],
      nomDePage,
    });
    expect(r.etat.actif.type).toBe("personnel");
    expect(r.etat.accesPerdu).toBe("BDE");
    expect(r.reinitialiser).toBe(true);
  });

  it("n'active qu'une page dont on est membre", () => {
    expect(peutActiver("bde", [bde])).toBe(true);
    expect(peutActiver("autre", [bde])).toBe(false);
    expect(peutActiver(null, [])).toBe(true);
  });
});
