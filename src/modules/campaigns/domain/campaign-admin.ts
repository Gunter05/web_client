import type {
  CampaignKind,
  CampaignPlacement,
  CampaignStatus,
} from "@/modules/campaigns/domain/campaign";

/** Campagne vue par un administrateur (ADR 0023 du backend). */
export type AdminCampaign = {
  id: string;
  kind: CampaignKind;
  sponsor: {
    type: "PAGE" | "ACCOUNT";
    id: string;
    /** `null` si la page ou le compte a disparu. */
    name: string | null;
  };
  title: string;
  body: string | null;
  posterUrl: string | null;
  bannerImageUrl: string | null;
  accentColor: string | null;
  ctaLabel: string;
  target: {
    type: "EVENT" | "PAGE" | "URL";
    eventId: string | null;
    pageId: string | null;
    url: string | null;
  };
  placements: CampaignPlacement[];
  startsAt: string;
  endsAt: string;
  status: CampaignStatus;
  priority: number;
  dismissible: boolean;
};

export type CampaignStats = {
  totals: { impressions: number; clicks: number; dismissals: number };
  /** Personnes distinctes qui ont cliqué, par emplacement (FLOATING_BOTTOM : « Détails »). */
  uniqueClicks: Partial<Record<CampaignPlacement, number>>;
  days: {
    day: string;
    placement: CampaignPlacement;
    impressions: number;
    clicks: number;
    dismissals: number;
  }[];
};

/** Valeurs envoyées par le formulaire d'administration, telles que l'API les attend. */
export type CampaignInput = {
  kind: CampaignKind;
  sponsorType: "PAGE" | "ACCOUNT";
  sponsorId: string;
  title: string;
  body: string | null;
  posterUrl: string | null;
  bannerImageUrl: string | null;
  accentColor: string | null;
  ctaLabel: string;
  targetType: "EVENT" | "PAGE" | "URL";
  targetEventId: string | null;
  targetPageId: string | null;
  targetUrl: string | null;
  placements: CampaignPlacement[];
  startsAt: string;
  endsAt: string;
  priority: number;
  dismissible: boolean;
};

/**
 * État affiché : le statut choisi par l'administrateur, précisé par la
 * période pour une campagne active (programmée, en cours, terminée).
 */
export type CampaignState =
  "DRAFT" | "PAUSED" | "scheduled" | "running" | "ended";

export function campaignState(
  c: Pick<AdminCampaign, "status" | "startsAt" | "endsAt">,
  now: Date,
): CampaignState {
  if (c.status !== "ACTIVE") return c.status;
  if (now < new Date(c.startsAt)) return "scheduled";
  return now < new Date(c.endsAt) ? "running" : "ended";
}
