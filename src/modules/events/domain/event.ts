/** Liste fermée (D3) ; les libellés FR/EN vivent dans le catalogue i18n. */
export const CATEGORIES = [
  "match",
  "interClub",
  "orientation",
  "party",
  "culture",
  "conference",
  "campusLife",
  "other",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const PERIODS = ["ongoing", "upcoming", "past"] as const;
export type Period = (typeof PERIODS)[number];

export type EventStatus = "published" | "updated" | "cancelled";

export type TrackedField = "startsAt" | "endsAt" | "location";
export type TrackedChange = {
  field: TrackedField;
  before: string | null;
  after: string | null;
};

export type Event = {
  /** Identifiant court, base du lien permanent /e/{id} (US-36). */
  id: string;
  organizerPageId: string;
  name: string;
  /** Instants ISO en UTC (D7). */
  startsAt: string;
  endsAt: string | null;
  location: string;
  categories: Category[];
  description: string | null;
  photoUrl: string | null;
  status: EventStatus;
  latestUpdate: { at: string; changes: TrackedChange[] } | null;
  cancellation: { reason: string; at: string } | null;
  createdAt: string;
};

// ——— Période (US-16) ———

/** Sans fin, l'événement se termine à 23h59 UTC le jour du début (D5). */
export function effectiveEnd(event: Pick<Event, "startsAt" | "endsAt">): Date {
  if (event.endsAt) return new Date(event.endsAt);
  const endsAt = new Date(event.startsAt);
  endsAt.setUTCHours(23, 59, 59, 999);
  return endsAt;
}

export function periodOf(
  event: Pick<Event, "startsAt" | "endsAt">,
  now: Date,
): Period {
  if (now < new Date(event.startsAt)) return "upcoming";
  if (now <= effectiveEnd(event)) return "ongoing";
  return "past";
}

// ——— Formulaire (US-11, US-15) ———

export type EventFormFields = {
  name: string;
  startsAt: string;
  endsAt: string;
  location: string;
  categories: string[];
  description: string;
};

export type EventContent = Pick<
  Event,
  "name" | "startsAt" | "endsAt" | "location" | "categories" | "description"
>;

export type FieldErrors = Record<string, string>;

export type Validation =
  { ok: true; content: EventContent } | { ok: false; fieldErrors: FieldErrors };

function instant(value: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Valide le formulaire. En modification, un début déjà passé peut rester tel
 * quel (US-15) : seul un nouveau début est contrôlé.
 */
export function validateEventForm(
  f: EventFormFields,
  now: Date,
  currentStartsAt: string | null = null,
): Validation {
  const fieldErrors: FieldErrors = {};
  const name = f.name.trim();
  const location = f.location.trim();
  const description = f.description.trim();
  const startsAt = instant(f.startsAt);
  const endsAt = instant(f.endsAt);

  if (!name) fieldErrors.name = "required";
  else if (name.length < 3 || name.length > 100)
    fieldErrors.name = "eventNameLength";

  if (!startsAt) fieldErrors.startsAt = "required";
  else {
    const unchanged =
      currentStartsAt !== null &&
      startsAt.getTime() === new Date(currentStartsAt).getTime();
    if (!unchanged && startsAt < now) fieldErrors.startsAt = "startsInPast";
  }

  if (!location) fieldErrors.location = "required";
  else if (location.length > 150) fieldErrors.location = "maxLength150";

  const categories = [...new Set(f.categories)].filter((c): c is Category =>
    (CATEGORIES as readonly string[]).includes(c),
  );
  if (categories.length === 0) fieldErrors.categories = "categoryRequired";

  if (description.length > 2000) fieldErrors.description = "maxLength2000";
  if (f.endsAt && !endsAt) fieldErrors.endsAt = "invalidDate";
  else if (endsAt && startsAt && endsAt <= startsAt)
    fieldErrors.endsAt = "endsBeforeStart";

  if (Object.keys(fieldErrors).length || !startsAt)
    return { ok: false, fieldErrors };
  return {
    ok: true,
    content: {
      name,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt ? endsAt.toISOString() : null,
      location,
      categories,
      description: description || null,
    },
  };
}

// ——— Cycle de vie (US-15, D9) ———

export function isEditable(event: Event, now: Date): boolean {
  return event.status !== "cancelled" && periodOf(event, now) !== "past";
}

/** Seuls le début, la fin et le lieu font passer au statut Modifié. */
export function trackedChanges(
  before: Event,
  after: EventContent,
): TrackedChange[] {
  const fields: TrackedField[] = ["startsAt", "endsAt", "location"];
  return fields
    .filter((field) => (before[field] ?? null) !== (after[field] ?? null))
    .map((field) => ({
      field,
      before: before[field] ?? null,
      after: after[field] ?? null,
    }));
}

export const CANCELLATION_REASON_MIN_LENGTH = 10;

// ——— Liste (US-16, US-17) ———

export type Filters = {
  categories: Category[];
  periods: Period[];
  pages: string[];
};

export const DEFAULT_FILTERS: Filters = {
  categories: [],
  periods: ["ongoing", "upcoming"],
  pages: [],
};

/** OU dans un même filtre, ET entre filtres. */
export function matches(event: Event, filters: Filters, now: Date): boolean {
  const periods = filters.periods.length
    ? filters.periods
    : DEFAULT_FILTERS.periods;
  if (!periods.includes(periodOf(event, now))) return false;
  if (
    filters.categories.length &&
    !event.categories.some((c) => filters.categories.includes(c))
  )
    return false;
  if (filters.pages.length && !filters.pages.includes(event.organizerPageId))
    return false;
  return true;
}

/**
 * En cours et à venir : début croissant (les En cours arrivent donc en tête).
 * Passés : début décroissant, placés après. À début égal : ordre alphabétique.
 * Le statut ne change pas la position.
 */
export function sort(events: readonly Event[], now: Date): Event[] {
  const rank = (e: Event) => (periodOf(e, now) === "past" ? 1 : 0);
  return [...events].sort((a, b) => {
    const ra = rank(a);
    const rb = rank(b);
    if (ra !== rb) return ra - rb;
    const gap = new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
    if (gap !== 0) return ra === 1 ? -gap : gap;
    return a.name.localeCompare(b.name, "fr");
  });
}

export const PAGE_SIZE = 20;
