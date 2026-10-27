import { useTranslations } from "next-intl";
import type { Campaign } from "@/modules/campaigns/domain/campaign";

/** « Sponsorisé · diffuseur » ou « Annonce · diffuseur » : jamais de pub déguisée. */
export function CampaignLabel({ campaign }: { campaign: Campaign }) {
  const t = useTranslations("campaigns");
  const label =
    campaign.kind === "ANNOUNCEMENT" ? t("announcementShort") : t("sponsored");
  return (
    <>
      {label} · {campaign.sponsor.name}
    </>
  );
}
