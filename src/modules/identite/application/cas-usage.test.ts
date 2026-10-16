import { beforeEach, describe, expect, it } from "vitest";
import type { Compte } from "../domain/compte";
import * as cas from "./cas-usage";
import type { Session } from "./ports";

let deps: cas.DepsIdentite;

beforeEach(() => {
  const comptes: Compte[] = [];
  const sessions: Session[] = [];
  deps = {
    comptes: {
      parId: (id) => comptes.find((c) => c.id === id),
      parEmail: (e) => comptes.find((c) => c.email === e),
      tous: () => comptes,
      ajouter: (c) => void comptes.push(c),
      modifier: (c) =>
        void comptes.splice(
          comptes.findIndex((x) => x.id === c.id),
          1,
          c,
        ),
    },
    sessions: {
      parToken: (t) => sessions.find((s) => s.token === t),
      ajouter: (s) => void sessions.push(s),
      modifier: () => {},
      supprimer: () => {},
    },
    hacheur: { hacher: (m) => `h:${m}`, verifier: (m, h) => h === `h:${m}` },
    horloge: { maintenant: () => new Date("2026-10-16T10:00:00Z") },
  };
});

describe("comptes", () => {
  it("inscrit, refuse un e-mail en double, puis connecte", () => {
    const inscription = cas.inscrire(deps, {
      nom: "Awa",
      email: "Awa@ecole.cm",
      motDePasse: "secret123",
    });
    expect(inscription.ok).toBe(true);
    const doublon = cas.inscrire(deps, {
      nom: "Awa 2",
      email: "awa@ecole.cm",
      motDePasse: "secret123",
    });
    expect(!doublon.ok && doublon.champs?.email).toBe("emailDejaUtilise");
    expect(cas.connecter(deps, "awa@ecole.cm", "faux").ok).toBe(false);
    const connexion = cas.connecter(deps, "AWA@ecole.cm", "secret123");
    expect(connexion.ok).toBe(true);
    const lue = cas.lireSession(deps, connexion.ok ? connexion.valeur : "");
    expect(lue?.compte.nom).toBe("Awa");
    expect(lue?.session.pageActiveId).toBeNull();
  });

  it("recherche par nom (3 caractères) ou e-mail exact, sans exposer l'e-mail", () => {
    cas.inscrire(deps, {
      nom: "Karim Mbarga",
      email: "karim@ecole.cm",
      motDePasse: "secret123",
    });
    expect(cas.rechercherProfils(deps, "ka")).toEqual([]);
    expect(cas.rechercherProfils(deps, "kar")[0]).not.toHaveProperty("email");
    expect(cas.rechercherProfils(deps, "karim@ecole.cm")).toHaveLength(1);
    expect(cas.rechercherProfils(deps, "karim@")).toHaveLength(0);
  });
});

describe("profil personnel", () => {
  it("modifie le nom et la photo, refuse un nom invalide", () => {
    const r = cas.inscrire(deps, {
      nom: "Awa",
      email: "awa@ecole.cm",
      motDePasse: "secret123",
    });
    if (!r.ok) throw new Error();
    const id = deps.comptes.tous()[0]!.id;
    expect(cas.modifierProfil(deps, id, { nom: "A" }).ok).toBe(false);
    expect(cas.modifierProfil(deps, "inconnu", { nom: "Awa" }).ok).toBe(false);
    expect(
      cas.modifierProfil(deps, id, { nom: "Awa N.", photo: "/media/a.png" }).ok,
    ).toBe(true);
    expect(deps.comptes.parId(id)).toMatchObject({
      nom: "Awa N.",
      photo: "/media/a.png",
    });
    expect(cas.lireSession(deps, undefined)).toBeNull();
    expect(cas.lireSession(deps, "jeton-inconnu")).toBeNull();
  });
});
