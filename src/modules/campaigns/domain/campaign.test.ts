import { describe, expect, it } from "vitest";
import {
  type Campaign,
  campaignHref,
  selectActive,
  sponsorHref,
} from "@/modules/campaigns/domain/campaign";
import { campaignState } from "@/modules/campaigns/domain/campaign-admin";

const now = new Date("2026-11-01T12:00:00Z");

function campaign(overrides: Partial<Campaign>): Campaign {
  return {
    id: "c",
    kind: "SPONSORED",
    sponsor: { type: "ACCOUNT", id: "a", name: "Sponsor", photoUrl: null },
    title: "Titre",
    body: null,
    posterUrl: null,
    bannerImageUrl: null,
    accentColor: null,
    ctaLabel: "Voir",
    target: { type: "URL", url: "https://example.com" },
    placements: ["FEED_TOP"],
    startsAt: "2026-10-01T00:00:00Z",
    endsAt: "2026-12-01T00:00:00Z",
    status: "ACTIVE",
    priority: 0,
    dismissible: true,
    ...overrides,
  };
}

describe("selectActive", () => {
  it("ignore les campagnes en pause, programmées ou terminées", () => {
    const active = selectActive(
      [
        campaign({ id: "paused", status: "PAUSED" }),
        campaign({ id: "future", startsAt: "2026-11-02T00:00:00Z" }),
        campaign({ id: "past", endsAt: "2026-11-01T12:00:00Z" }),
      ],
      now,
    );
    expect(active).toEqual({});
  });

  it("garde la plus haute priorité par emplacement", () => {
    const active = selectActive(
      [
        campaign({ id: "low", placements: ["FEED_TOP", "FLOATING_BOTTOM"] }),
        campaign({ id: "high", priority: 5, placements: ["FEED_TOP"] }),
      ],
      now,
    );
    expect(active.FEED_TOP?.id).toBe("high");
    expect(active.FLOATING_BOTTOM?.id).toBe("low");
  });

  it("départage par la date de début la plus récente", () => {
    const active = selectActive(
      [
        campaign({ id: "old" }),
        campaign({ id: "new", startsAt: "2026-10-20T00:00:00Z" }),
      ],
      now,
    );
    expect(active.FEED_TOP?.id).toBe("new");
  });
});

describe("sponsorHref", () => {
  it("renvoie vers la page, pas vers un compte", () => {
    expect(
      sponsorHref({
        type: "PAGE",
        id: "p",
        slug: "bds",
        name: "BDS",
        photoUrl: null,
      }),
    ).toBe("/p/bds");
    expect(
      sponsorHref({ type: "ACCOUNT", id: "a", name: "Awa", photoUrl: null }),
    ).toBeNull();
  });
});

describe("campaignHref", () => {
  it("pointe vers un événement, une page ou un lien", () => {
    expect(campaignHref({ type: "EVENT", eventId: "42" })).toBe("/e/42");
    expect(campaignHref({ type: "PAGE", pageSlug: "bds" })).toBe("/p/bds");
    expect(campaignHref({ type: "URL", url: "https://x.y" })).toBe(
      "https://x.y",
    );
  });
});

describe("campaignState", () => {
  const period = {
    startsAt: "2026-10-01T00:00:00Z",
    endsAt: "2026-12-01T00:00:00Z",
  };
  it("précise une campagne active par sa période", () => {
    expect(campaignState({ ...period, status: "ACTIVE" }, now)).toBe("running");
    expect(
      campaignState({ ...period, status: "ACTIVE" }, new Date("2026-09-01")),
    ).toBe("scheduled");
    expect(
      campaignState({ ...period, status: "ACTIVE" }, new Date("2027-01-01")),
    ).toBe("ended");
    expect(campaignState({ ...period, status: "PAUSED" }, now)).toBe("PAUSED");
  });
});
