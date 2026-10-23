import { describe, expect, it } from "vitest";
import type { EventView } from "@/modules/events/domain/event-view.types";
import { nextEvent } from "@/modules/events/domain/next-event";

const base: EventView = {
  id: "x",
  organizerPageId: "bde",
  name: "Événement",
  startsAt: "2026-11-01T18:00:00Z",
  endsAt: null,
  location: "Campus",
  categories: ["other"],
  description: null,
  photoUrl: null,
  status: "published",
  latestUpdate: null,
  cancellation: null,
  createdAt: "2026-10-01T10:00:00Z",
  period: "upcoming",
  organizer: { id: "bde", name: "BDE", slug: "bde", photoUrl: null },
};
const ev = (id: string, changes: Partial<EventView>): EventView => ({
  ...base,
  id,
  ...changes,
});

describe("prochain événement d'une page", () => {
  it("choisit l'événement à venir qui commence le plus tôt, quel que soit l'ordre", () => {
    const events = [
      ev("tard", { startsAt: "2026-12-10T18:00:00Z" }),
      ev("passe", { startsAt: "2026-09-01T18:00:00Z", period: "past" }),
      ev("bientot", { startsAt: "2026-11-02T18:00:00Z" }),
      ev("en-cours", { startsAt: "2026-10-20T18:00:00Z", period: "ongoing" }),
    ];
    expect(nextEvent(events)?.id).toBe("bientot");
  });

  it("ignore un événement annulé, même s'il est le plus proche", () => {
    const events = [
      ev("annule", { startsAt: "2026-11-01T18:00:00Z", status: "cancelled" }),
      ev("modifie", { startsAt: "2026-11-05T18:00:00Z", status: "updated" }),
    ];
    expect(nextEvent(events)?.id).toBe("modifie");
  });

  it("ne renvoie rien sans événement à venir", () => {
    expect(nextEvent([])).toBeNull();
    expect(
      nextEvent([
        ev("passe", { period: "past" }),
        ev("live", { period: "ongoing" }),
      ]),
    ).toBeNull();
  });
});
