import { FloatingCampaignBanner } from "@/modules/campaigns";
import { trackCampaignAction } from "@/modules/campaigns/application/campaigns.actions";
import { getActiveCampaigns } from "@/modules/campaigns/server";

/** Bannière de campagne du bas, sur les écrans principaux (téléphone). */
export async function CampaignBanner() {
  const campaign = (await getActiveCampaigns()).FLOATING_BOTTOM;
  return campaign ? (
    <FloatingCampaignBanner campaign={campaign} track={trackCampaignAction} />
  ) : null;
}
