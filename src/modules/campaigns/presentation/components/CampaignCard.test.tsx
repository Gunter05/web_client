import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import messages from "@/shared/i18n/messages/fr.json";
import type {
  Campaign,
  CampaignSponsor,
} from "@/modules/campaigns/domain/campaign";
import { CampaignCard } from "@/modules/campaigns/presentation/components/CampaignCard";

function campaign(sponsor: CampaignSponsor): Campaign {
  return {
    id: "c1",
    kind: "SPONSORED",
    sponsor,
    title: "Le sport étudiant",
    body: null,
    posterUrl: null,
    bannerImageUrl: null,
    accentColor: "#EA580C",
    ctaLabel: "Programme",
    target: { type: "URL", url: "https://example.com" },
    placements: ["FEED_TOP"],
    startsAt: "2026-01-01T00:00:00Z",
    endsAt: "2099-01-01T00:00:00Z",
    status: "ACTIVE",
    priority: 0,
    dismissible: true,
  };
}

function header(sponsor: CampaignSponsor) {
  const { container } = render(
    <NextIntlClientProvider locale="fr" messages={messages}>
      <CampaignCard campaign={campaign(sponsor)} />
    </NextIntlClientProvider>,
  );
  return container.querySelector("header")!;
}

describe("CampaignCard", () => {
  it("ne met aucun lien sur l'avatar ni le nom d'un compte", () => {
    const h = header({
      type: "ACCOUNT",
      id: "a",
      name: "Awa Ndiaye",
      photoUrl: null,
    });
    expect(h.querySelectorAll("a")).toHaveLength(0);
    expect(screen.getByText("Awa Ndiaye").closest("a")).toBeNull();
  });

  it("relie l'avatar et le nom d'une page à sa page publique", () => {
    const h = header({
      type: "PAGE",
      id: "p",
      slug: "bureau-des-sports",
      name: "Bureau des sports",
      photoUrl: null,
    });
    const hrefs = [...h.querySelectorAll("a")].map((a) =>
      a.getAttribute("href"),
    );
    expect(hrefs).toEqual(["/p/bureau-des-sports", "/p/bureau-des-sports"]);
  });
});
