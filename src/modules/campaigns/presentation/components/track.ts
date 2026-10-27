import type {
  CampaignInteraction,
  CampaignPlacement,
} from "@/modules/campaigns/domain/campaign";

/** Mesure d'une campagne, injectée par la page (Server Action). */
export type TrackCampaign = (
  campaignId: string,
  placement: CampaignPlacement,
  kind: CampaignInteraction,
) => Promise<void>;
