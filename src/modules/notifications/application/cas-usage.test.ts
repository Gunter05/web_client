import { beforeEach, describe, expect, it } from "vitest";
import type { Notification } from "../domain/notification";
import * as cas from "./cas-usage";

let deps: cas.DepsNotifications;

beforeEach(() => {
  let notifications: Notification[] = [];
  deps = {
    notifications: {
      toutes: () => notifications,
      ajouter: (n) => void notifications.push(...n),
      marquerLues: (id) => {
        notifications = notifications.map((n) =>
          n.destinataireId === id ? { ...n, lue: true } : n,
        );
      },
    },
    horloge: { maintenant: () => new Date("2026-10-16T10:00:00Z") },
  };
});

describe("cloche (notifications dans l'application)", () => {
  it("compte les non-lues par destinataire, puis les marque lues", () => {
    cas.notifier(deps, { type: "accesDonne", nomPage: "BDE", compteId: "k" });
    cas.notifier(
      deps,
      { type: "demandeDeposee", demandeId: "d", nomPage: "Club" },
      ["a1"],
    );
    expect(cas.nombreNonLues(deps, "k")).toBe(1);
    expect(cas.lister(deps, "a1")[0]?.type).toBe("nouvelleDemande");
    deps.notifications.marquerLues("k");
    expect(cas.nombreNonLues(deps, "k")).toBe(0);
  });

  it("n'ajoute rien quand aucun destinataire n'est concerné", () => {
    cas.notifier(
      deps,
      { type: "demandeDeposee", demandeId: "d", nomPage: "Club" },
      [],
    );
    expect(deps.notifications.toutes()).toHaveLength(0);
  });
});
