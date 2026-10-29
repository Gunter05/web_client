/**
 * Formats de date de US-16, dans le fuseau de l'appareil (D7) :
 * « Aujourd'hui, 15h00 », « Demain, 15h00 », « samedi 17 octobre, 15h00 »,
 * « Today, 3:00 PM », « Saturday, October 17, 3:00 PM ». Année ajoutée si différente.
 */
export type Labels = {
  today: (time: string) => string;
  tomorrow: (time: string) => string;
};

/**
 * Fuseau de l'appareil (« Africa/Douala »). À passer à `useFormatter()` :
 * next-intl lui donne sinon le fuseau du serveur (UTC sur Vercel).
 */
export function deviceTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

const intlLocale = (locale: string) => (locale === "fr" ? "fr-FR" : "en-US");

function localDay(date: Date, timeZone?: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function formatTime(
  date: Date,
  locale: string,
  timeZone?: string,
): string {
  if (locale === "fr") {
    return new Intl.DateTimeFormat("fr-FR", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
    })
      .format(date)
      .replace(":", "h");
  }
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatDay(
  date: Date,
  locale: string,
  now: Date,
  timeZone?: string,
): string {
  const sameYear =
    localDay(date, timeZone).slice(0, 4) ===
    localDay(now, timeZone).slice(0, 4);
  return new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: sameYear ? undefined : "numeric",
  }).format(date);
}

export function formatEventDate(
  iso: string,
  locale: string,
  labels: Labels,
  now = new Date(),
  timeZone?: string,
): string {
  const date = new Date(iso);
  const time = formatTime(date, locale, timeZone);
  const day = localDay(date, timeZone);
  if (day === localDay(now, timeZone)) return labels.today(time);
  const tomorrow = new Date(now.getTime() + 24 * 3_600_000);
  if (day === localDay(tomorrow, timeZone)) return labels.tomorrow(time);
  return `${formatDay(date, locale, now, timeZone)}, ${time}`;
}

/** Date courte pour les tableaux (« 14 oct. 2026 »). */
export function formatShortDate(
  iso: string,
  locale: string,
  timeZone?: string,
): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone,
    dateStyle: "medium",
  }).format(new Date(iso));
}
