import {
  type CampaignPlacement,
  impressionToSend,
  type SeenImpressions,
} from "@/modules/campaigns/domain/campaign";
import type { TrackCampaign } from "@/modules/campaigns/presentation/components/track";

const STORAGE_KEY = "contineng_impressions";

function read(): SeenImpressions | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? (JSON.parse(value) as SeenImpressions) : null;
  } catch {
    return null;
  }
}

/**
 * Envoie l'impression d'une campagne une fois par jour au plus : chaque
 * affichage n'est plus une requête. Stockage indisponible (navigation
 * privée) : l'impression est envoyée à chaque affichage, comme avant.
 */
export function trackImpressionOncePerDay(
  track: TrackCampaign | undefined,
  campaignId: string,
  placement: CampaignPlacement,
) {
  if (!track) return;
  const next = impressionToSend(read(), new Date(), campaignId, placement);
  if (!next) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Rien à mémoriser : l'impression part quand même.
  }
  void track(campaignId, placement, "IMPRESSION");
}
