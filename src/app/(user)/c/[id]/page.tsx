import { MegaphoneIcon } from "@/shared/components/icons";
import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { CampaignCard } from "@/modules/campaigns";
import { getCampaign } from "@/modules/campaigns/server";
import { ContentSkeleton } from "@/shared/components/layout/ContentSkeleton";
import { buttonVariants } from "@/shared/ui/button";

/** Aperçu WhatsApp d'une campagne partagée : titre, texte et affiche (opengraph-image). */
export async function generateMetadata({
  params,
}: PageProps<"/c/[id]">): Promise<Metadata> {
  const campaign = await getCampaign((await params).id);
  const t = await getTranslations("campaigns");
  if (!campaign) return { title: t("notFound") };
  const description = campaign.body ?? campaign.sponsor.name;
  return {
    title: campaign.title,
    description,
    alternates: { canonical: `/c/${campaign.id}` },
    openGraph: {
      type: "website",
      title: campaign.title,
      description,
      url: `/c/${campaign.id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: campaign.title,
      description,
    },
  };
}

/** Page d'une campagne partagée, accessible sans compte : sa carte, comme dans le fil. */
async function CampaignPage({ params }: PageProps<"/c/[id]">) {
  const t = await getTranslations("campaigns");
  const campaign = await getCampaign((await params).id);
  if (!campaign) {
    return (
      <div className="flex flex-col items-center gap-4 px-4 py-24 text-center">
        <MegaphoneIcon className="size-12 text-muted-foreground" />
        <h1 className="text-xl font-semibold">{t("notFound")}</h1>
        <Link href="/" className={buttonVariants({ size: "lg" })}>
          {t("backToList")}
        </Link>
      </div>
    );
  }
  return (
    <div className="mx-auto grid max-w-[470px] gap-4 pt-4 sm:px-4 md:pt-8">
      <CampaignCard campaign={campaign} />
    </div>
  );
}

export default function Page(props: PageProps<"/c/[id]">) {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <CampaignPage {...props} />
    </Suspense>
  );
}
