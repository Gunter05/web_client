"use server";

import { z } from "zod";
import {
  CAMPAIGN_INTERACTIONS,
  CAMPAIGN_PLACEMENTS,
} from "@/modules/campaigns/domain/campaign";
import { trackCampaign } from "@/modules/campaigns/server";

const input = z.object({
  campaignId: z.string().min(1).max(64),
  placement: z.enum(CAMPAIGN_PLACEMENTS),
  kind: z.enum(CAMPAIGN_INTERACTIONS),
});

/**
 * Impression, clic ou fermeture d'une campagne. Publique (visiteurs sans
 * compte compris) et sans donnée personnelle : l'API n'agrège que des compteurs.
 */
export async function trackCampaignAction(
  campaignId: string,
  placement: string,
  kind: string,
): Promise<void> {
  const parsed = input.safeParse({ campaignId, placement, kind });
  if (!parsed.success) return;
  const d = parsed.data;
  await trackCampaign(d.campaignId, d.placement, d.kind).catch(() => {
    // Une mesure perdue ne doit jamais gêner la navigation.
  });
}
