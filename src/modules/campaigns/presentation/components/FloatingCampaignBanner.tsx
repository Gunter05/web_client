"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { XIcon } from "@/shared/components/icons";
import type { Campaign } from "@/modules/campaigns/domain/campaign";
import { CampaignLabel } from "@/modules/campaigns/presentation/components/CampaignLabel";
import { CampaignLink } from "@/modules/campaigns/presentation/components/CampaignLink";
import {
  DISMISS_EVENT,
  useCampaignDismissal,
} from "@/modules/campaigns/presentation/components/useCampaignDismissal";
import type { TrackCampaign } from "@/modules/campaigns/presentation/components/track";
import { trackImpressionOncePerDay } from "@/modules/campaigns/presentation/components/track-impression";
import { mediaSrc } from "@/shared/lib/media-src";

/** Délai avant l'apparition : on laisse d'abord voir la page. */
const APPEAR_AFTER_MS = 1500;

/**
 * Bannière façon TikTok (FLOATING_BOTTOM), sur téléphone : toute la largeur,
 * sans arrondi, collée au-dessus de la barre de navigation, basse (56 px),
 * sur la couleur de la campagne, avec le titre et le bouton d'action. Son visuel détouré reste à gauche et
 * déborde par le haut, dans des bornes fixes pour ne jamais couvrir l'écran.
 * La croix est posée juste au-dessus. Elle s'efface tant qu'une carte de campagne est visible
 * dans le fil : jamais deux mises en avant à l'écran.
 */
export function FloatingCampaignBanner({
  campaign,
  track,
}: {
  campaign: Campaign;
  track?: TrackCampaign;
}) {
  const t = useTranslations("campaigns");
  const { dismissed, dismiss } = useCampaignDismissal(campaign.id);
  const [ready, setReady] = useState(false);
  const cardOnScreen = useCampaignCardOnScreen();
  const shown = ready && !dismissed && !cardOnScreen;

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), APPEAR_AFTER_MS);
    return () => clearTimeout(timer);
  }, []);

  // Une impression par jour, même si la carte du fil la masque un temps.
  const seen = useRef(false);
  useEffect(() => {
    if (!shown || seen.current) return;
    seen.current = true;
    trackImpressionOncePerDay(track, campaign.id, "FLOATING_BOTTOM");
  }, [shown, campaign.id, track]);

  if (!shown) return null;
  const accent = campaign.accentColor ?? "var(--brand)";
  const record = (kind: "CLICK" | "DISMISS") =>
    void track?.(campaign.id, "FLOATING_BOTTOM", kind);
  return (
    <>
      {/* Réserve la place sous le contenu : la bannière ne cache jamais la fin du fil */}
      <div aria-hidden className="h-14 md:hidden" />
      <aside
        aria-label={campaign.title}
        className="fixed inset-x-0 bottom-[calc(3rem+env(safe-area-inset-bottom))] z-20 motion-safe:animate-in motion-safe:duration-300 motion-safe:fade-in motion-safe:slide-in-from-bottom-4 md:hidden"
      >
        {campaign.dismissible && (
          // Au-dessus de la bannière, hors de la zone cliquable : fermer n'ouvre jamais la campagne
          <button
            type="button"
            aria-label={t("close")}
            onClick={() => {
              dismiss();
              record("DISMISS");
            }}
            className="absolute -top-9 right-2 grid size-8 place-items-center rounded-full border bg-background text-foreground shadow-md"
          >
            <XIcon className="size-4" />
          </button>
        )}
        <CampaignLink
          to={campaign.target}
          onClick={() => record("CLICK")}
          className="relative flex h-14 w-full items-center gap-2 pr-2 text-white"
          style={{
            background: accent,
            paddingLeft: campaign.bannerImageUrl ? "6.5rem" : "1rem",
          }}
        >
          {campaign.bannerImageUrl && (
            // Visuel détouré à gauche, qui déborde par le haut. Bornes fixes :
            // 96 px de large et 88 px de haut au plus (32 px au-dessus de la
            // bannière), quelle que soit l'image envoyée.
            // eslint-disable-next-line @next/next/no-img-element -- visuel détouré, fond transparent
            <img
              src={mediaSrc(campaign.bannerImageUrl)}
              alt=""
              className="pointer-events-none absolute bottom-0 left-2 max-h-[5.5rem] max-w-24 object-contain object-bottom drop-shadow-md"
            />
          )}
          <span className="grid min-w-0 flex-1 leading-tight">
            <span className="truncate text-[11px] text-white/85">
              <CampaignLabel campaign={campaign} />
            </span>
            <span className="truncate text-sm font-semibold">
              {campaign.title}
            </span>
          </span>
          <span
            className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold"
            style={{ color: accent }}
          >
            {t("details")}
          </span>
        </CampaignLink>
      </aside>
    </>
  );
}

/** Une carte de campagne du fil est-elle à l'écran ? */
function useCampaignCardOnScreen(): boolean {
  const [onScreen, setOnScreen] = useState(false);
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const card = document.querySelector("[data-campaign-card]");
      const r = card?.getBoundingClientRect();
      setOnScreen(!!r && r.bottom > 0 && r.top < window.innerHeight);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener(DISMISS_EVENT, schedule);
    // La carte arrive après le cadre (Suspense) : on vérifie à son arrivée.
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener(DISMISS_EVENT, schedule);
      observer.disconnect();
    };
  }, []);
  return onScreen;
}
