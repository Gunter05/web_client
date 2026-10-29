import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import messages from "@/shared/i18n/messages/fr.json";
import type { EventView } from "@/modules/events/domain/event-view.types";
import { EventPracticalInfo } from "@/modules/events/presentation/components/EventInfo";

const event: EventView = {
  id: "gala26xx",
  organizerPageId: "bde",
  name: "Soirée de gala",
  // 00h30 – 02h00 le dimanche à Douala (UTC+1), encore samedi en UTC
  startsAt: "2026-11-07T23:30:00Z",
  endsAt: "2026-11-08T01:00:00Z",
  location: "Salle des fêtes",
  categories: ["party"],
  description: null,
  photoUrl: null,
  status: "published",
  latestUpdate: null,
  cancellation: null,
  createdAt: "2026-10-01T10:00:00Z",
  period: "upcoming",
  organizer: { id: "bde", name: "BDE", slug: "bde", photoUrl: null },
};

describe("EventPracticalInfo (D7)", () => {
  const tz = process.env.TZ;
  beforeAll(() => {
    process.env.TZ = "Africa/Douala";
  });
  afterAll(() => {
    process.env.TZ = tz;
  });

  it("affiche le jour et l'heure de l'appareil, pas ceux du serveur", () => {
    // next-intl transmet au navigateur le fuseau du serveur (UTC sur Vercel)
    render(
      <NextIntlClientProvider locale="fr" messages={messages} timeZone="UTC">
        <EventPracticalInfo event={event} />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText("dimanche 8 novembre")).toBeInTheDocument();
    expect(screen.getByText("00:30 – 02:00 UTC+1")).toBeInTheDocument();
  });
});
