import "server-only";
import type {
  AdminCampaign,
  CampaignInput,
  CampaignStats,
} from "@/modules/campaigns/domain/campaign-admin";
import type { CampaignStatus } from "@/modules/campaigns/domain/campaign";
import { api, apiOrNull } from "@/shared/api/client";

/** Campagnes côté administration ; le rôle est vérifié par l'API à chaque appel. */
export const campaignsAdminApi = {
  list: () => api<AdminCampaign[]>("/api/v1/admin/campaigns"),
  get: (id: string) =>
    apiOrNull<AdminCampaign>(
      `/api/v1/admin/campaigns/${encodeURIComponent(id)}`,
    ),
  stats: (id: string) =>
    api<CampaignStats>(
      `/api/v1/admin/campaigns/${encodeURIComponent(id)}/stats`,
    ),
  create: (input: CampaignInput) =>
    api<AdminCampaign>("/api/v1/admin/campaigns", { body: input }),
  update: (id: string, input: CampaignInput) =>
    api<AdminCampaign>(`/api/v1/admin/campaigns/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: input,
    }),
  remove: (id: string) =>
    api<void>(`/api/v1/admin/campaigns/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
  changeStatus: (id: string, status: CampaignStatus) =>
    api<AdminCampaign>(
      `/api/v1/admin/campaigns/${encodeURIComponent(id)}/status`,
      { method: "PUT", body: { status } },
    ),
};
