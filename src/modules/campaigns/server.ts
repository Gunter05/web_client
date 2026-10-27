import "server-only";
import { cache } from "react";
import { campaignsApi } from "@/modules/campaigns/infrastructure/campaigns.api";

/** Campagnes en cours, une par emplacement (même contenu pour tous). */
export const getActiveCampaigns = cache(() => campaignsApi.active());

export const getCampaign = cache((id: string) => campaignsApi.get(id));

export const trackCampaign = campaignsApi.track;

// ——— Administration (ADR 0023 du backend) ———
export type {
  AdminCampaign,
  CampaignInput,
  CampaignStats,
} from "@/modules/campaigns/domain/campaign-admin";
export { campaignsAdminApi as campaignsAdmin } from "@/modules/campaigns/infrastructure/campaigns-admin.api";
