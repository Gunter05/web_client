/** Lignes de l'espace Administration (US-07), telles que l'API les renvoie. */
export type AdminAccount = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  emailVerified: boolean;
  /** Fin de la suspension ; `null` si le compte n'est pas suspendu. */
  suspendedUntil: string | null;
  createdAt: string;
};

export type AdminPage = {
  id: string;
  slug: string;
  name: string;
  /** Code d'un type d'organisation (catalogue `pages.types`). */
  type: "club" | "association" | "studentUnion" | "schoolService" | "other";
  photoUrl: string | null;
  createdAt: string;
  owner: string | null;
  eventCount: number;
  memberCount: number;
};

export type AdminEvent = {
  id: string;
  name: string;
  organizerPageId: string;
  pageName: string;
  startsAt: string;
  status: "published" | "updated" | "cancelled";
  createdAt: string;
};

export type AdminMember = {
  accountId: string;
  name: string;
  photoUrl: string | null;
  role: "owner" | "contributor";
  addedAt: string;
};

export type AdminPageDetails = {
  page: AdminPage;
  members: AdminMember[];
  events: AdminEvent[];
};

/** Visiteurs uniques d'une période, dont ceux de l'application installée. */
export type ActivityPeriod = { visitors: number; installedApp: number };

/** Activité des visiteurs anonymes : jour, 7 et 30 derniers jours (UTC). */
export type AdminActivity = {
  today: ActivityPeriod;
  week: ActivityPeriod;
  month: ActivityPeriod;
  /** Installations signalées : Chrome et Android seulement, chiffre sous-estimé. */
  installs: { week: number; month: number; total: number };
};
