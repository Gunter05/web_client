import type {
  Campaign,
  CampaignSponsor,
} from "@/modules/campaigns/domain/campaign";

/**
 * Données de démonstration (CAMPAIGNS_DEMO) pour choisir le design avant que
 * l'API ne serve les campagnes. Une liste par scénario.
 */
const LONG_AGO = "2026-01-01T00:00:00Z";
const FAR_AHEAD = "2099-01-01T00:00:00Z";

const base = {
  startsAt: LONG_AGO,
  endsAt: FAR_AHEAD,
  status: "ACTIVE",
  priority: 0,
  dismissible: true,
} as const;

const candidate: CampaignSponsor = {
  type: "ACCOUNT",
  id: "demo-compte-candidat",
  name: "Awa Nkoulou",
  photoUrl: null,
};
const sportsOfficePage: CampaignSponsor = {
  type: "PAGE",
  id: "demo-page-bds",
  slug: "bureau-des-sports",
  name: "Bureau des sports",
  photoUrl: null,
};
const partnerPage: CampaignSponsor = {
  type: "PAGE",
  id: "demo-page-partenaire",
  slug: "formations-tech-pro",
  name: "Formations Tech Pro",
  photoUrl: null,
};
const studentOffice: CampaignSponsor = {
  type: "PAGE",
  id: "demo-page-bde",
  slug: "bde",
  name: "BDE",
  photoUrl: null,
};

const sportsOffice: Campaign = {
  ...base,
  id: "demo-bds",
  kind: "SPONSORED",
  sponsor: candidate,
  title: "Une nouvelle vision pour le sport étudiant",
  body: "Tournois inter-classes chaque mois, équipements renouvelés, créneaux de salle ouverts le soir et le week-end, et une vraie place pour le sport féminin. Découvre le programme complet et vote le 12 novembre.",
  posterUrl: "/campaigns/poster-bds.svg",
  bannerImageUrl: "/campaigns/basketball.svg",
  accentColor: "#EA580C",
  ctaLabel: "Programme",
  target: { type: "PAGE", pageSlug: "bureau-des-sports" },
  placements: ["FEED_TOP", "FLOATING_BOTTOM"],
};

const tournament: Campaign = {
  ...base,
  id: "demo-tournoi",
  kind: "SPONSORED",
  sponsor: sportsOfficePage,
  title: "Tournoi interclasses : inscriptions ouvertes",
  body: "Forme ton équipe avant vendredi.",
  posterUrl: "/campaigns/trophy.svg",
  bannerImageUrl: "/campaigns/trophy.svg",
  accentColor: "#CA8A04",
  ctaLabel: "S'inscrire",
  target: { type: "PAGE", pageSlug: "bureau-des-sports" },
  placements: ["FLOATING_BOTTOM"],
};

const partner: Campaign = {
  ...base,
  id: "demo-partenaire",
  kind: "SPONSORED",
  sponsor: partnerPage,
  title: "Apprends React en 6 semaines",
  body: "Formations pratiques pour les étudiants de Saint Jean Ingénieur.",
  posterUrl: "/campaigns/laptop.svg",
  bannerImageUrl: "/campaigns/laptop.svg",
  accentColor: "#2563EB",
  ctaLabel: "Découvrir",
  target: { type: "URL", url: "https://example.com" },
  placements: ["FEED_TOP", "FLOATING_BOTTOM"],
};

const announcement: Campaign = {
  ...base,
  id: "demo-annonce",
  kind: "ANNOUNCEMENT",
  sponsor: studentOffice,
  title: "Élections du bureau des sports le 12 novembre",
  body: "Découvre les programmes des candidats avant de voter.",
  posterUrl: "/campaigns/megaphone.svg",
  bannerImageUrl: "/campaigns/megaphone.svg",
  accentColor: "#E11D48",
  ctaLabel: "Voir les candidats",
  target: { type: "PAGE", pageSlug: "bureau-des-sports" },
  placements: ["FEED_TOP", "FLOATING_BOTTOM"],
};

export const DEMO_SCENARIOS = {
  /** Candidat BDS : carte en haut du fil et bannière du bas. */
  bds: [sportsOffice],
  /** Carte du candidat, bannière d'une autre campagne (priorité par emplacement). */
  mix: [
    { ...sportsOffice, placements: ["FEED_TOP"] },
    tournament,
  ] as Campaign[],
  /** Partenaire externe (lien sortant). */
  partner: [partner],
  /** Annonce officielle, sans mention « Sponsorisé ». */
  announcement: [announcement],
} satisfies Record<string, Campaign[]>;

export type DemoScenario = keyof typeof DEMO_SCENARIOS;
