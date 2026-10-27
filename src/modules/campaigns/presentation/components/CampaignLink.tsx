import Link from "next/link";
import type { ComponentProps } from "react";
import {
  type CampaignTarget,
  campaignHref,
  isExternal,
} from "@/modules/campaigns/domain/campaign";

/** Lien vers la cible d'une campagne ; un lien externe s'ouvre à part. */
export function CampaignLink({
  to,
  ...props
}: { to: CampaignTarget } & Omit<ComponentProps<"a">, "href" | "target">) {
  const href = campaignHref(to);
  return isExternal(to) ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      {...props}
    />
  ) : (
    <Link href={href} {...props} />
  );
}
