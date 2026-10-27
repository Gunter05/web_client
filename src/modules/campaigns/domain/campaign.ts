/**
 * Campagne : toute mise en avant (sponsorisée ou annonce officielle), hors
 * du fil normal. Elle ne copie pas un contenu : elle pointe vers un
 * événement, une page ou un lien (comme une publicité Instagram « boostée »).
 */
export const CAMPAIGN_PLACEMENTS = ["FEED_TOP", "FLOATING_BOTTOM"] as const;
export type CampaignPlacement = (typeof CAMPAIGN_PLACEMENTS)[number];

export type CampaignKind = "SPONSORED" | "ANNOUNCEMENT";
export type CampaignStatus = "DRAFT" | "ACTIVE" | "PAUSED";

export type CampaignTarget =
  | { type: "EVENT"; eventId: string }
  | { type: "PAGE"; pageSlug: string }
  | { type: "URL"; url: string };

/**
 * Qui diffuse la campagne : toujours un compte (un candidat, un particulier)
 * ou une page (club, entreprise, BDE). C'est son nom et sa photo qui signent
 * la campagne, comme l'auteur d'une publication.
 */
export type CampaignSponsor =
  | {
      type: "PAGE";
      id: string;
      slug: string;
      name: string;
      photoUrl: string | null;
    }
  | { type: "ACCOUNT"; id: string; name: string; photoUrl: string | null };

export interface Campaign {
  id: string;
  kind: CampaignKind;
  sponsor: CampaignSponsor;
  title: string;
  body: string | null;
  /** Affiche de la carte en tête du fil. */
  posterUrl: string | null;
  /**
   * Visuel détouré (fond transparent) de la bannière du bas : posé à gauche,
   * il déborde par le haut, dans des bornes fixes.
   */
  bannerImageUrl: string | null;
  /** Couleur d'accent de la créa (fond de la bannière, bouton). */
  accentColor: string | null;
  ctaLabel: string;
  target: CampaignTarget;
  placements: CampaignPlacement[];
  startsAt: string;
  endsAt: string;
  status: CampaignStatus;
  priority: number;
  dismissible: boolean;
}

/** Au plus une campagne par emplacement. */
export type ActiveCampaigns = Partial<Record<CampaignPlacement, Campaign>>;

export function isRunning(c: Campaign, now: Date): boolean {
  const t = now.getTime();
  return (
    c.status === "ACTIVE" &&
    Date.parse(c.startsAt) <= t &&
    t < Date.parse(c.endsAt)
  );
}

/**
 * Par emplacement : la campagne en cours de plus haute priorité, puis la plus
 * récente. Règle portée par l'API ; le front l'applique aux données de démo.
 */
export function selectActive(
  campaigns: Campaign[],
  now: Date,
): ActiveCampaigns {
  const result: ActiveCampaigns = {};
  const running = campaigns
    .filter((c) => isRunning(c, now))
    .sort(
      (a, b) =>
        b.priority - a.priority ||
        Date.parse(b.startsAt) - Date.parse(a.startsAt),
    );
  for (const c of running) {
    for (const p of c.placements) result[p] ??= c;
  }
  return result;
}

/** Lien ouvert au clic sur la campagne. */
export function campaignHref(target: CampaignTarget): string {
  switch (target.type) {
    case "EVENT":
      return `/e/${encodeURIComponent(target.eventId)}`;
    case "PAGE":
      return `/p/${encodeURIComponent(target.pageSlug)}`;
    case "URL":
      return target.url;
  }
}

/** Profil du diffuseur : une page a une adresse publique, un compte non. */
export function sponsorHref(sponsor: CampaignSponsor): string | null {
  return sponsor.type === "PAGE"
    ? `/p/${encodeURIComponent(sponsor.slug)}`
    : null;
}

export const isExternal = (target: CampaignTarget) => target.type === "URL";

/** Clé de mémoire de fermeture, par campagne : une nouvelle campagne réapparaît. */
export const dismissKey = (id: string) => `campaign-dismissed:${id}`;

export const CAMPAIGN_INTERACTIONS = [
  "IMPRESSION",
  "CLICK",
  "DISMISS",
] as const;
export type CampaignInteraction = (typeof CAMPAIGN_INTERACTIONS)[number];

/**
 * Impressions déjà envoyées aujourd'hui (jour UTC, comme les visites) : une
 * seule par personne, campagne et emplacement et par jour, soit le nombre de
 * personnes qui l'ont vue dans la journée, et non le nombre d'affichages.
 */
export type SeenImpressions = { day: string; keys: string[] };

export function impressionToSend(
  seen: SeenImpressions | null,
  now: Date,
  campaignId: string,
  placement: CampaignPlacement,
): SeenImpressions | null {
  const day = now.toISOString().slice(0, 10);
  const key = `${campaignId}:${placement}`;
  // Un autre jour : la liste repart de zéro.
  const keys = seen?.day === day ? seen.keys : [];
  return keys.includes(key) ? null : { day, keys: [...keys, key] };
}
