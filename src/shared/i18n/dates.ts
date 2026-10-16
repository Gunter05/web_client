/**
 * Formats de date de US-16, dans le fuseau de l'appareil (D7) :
 * « Aujourd'hui, 15h00 », « Demain, 15h00 », « samedi 17 octobre, 15h00 »,
 * « Today, 3:00 PM », « Saturday, October 17, 3:00 PM ». Année ajoutée si différente.
 */
export type Libelles = {
  aujourdhui: (heure: string) => string;
  demain: (heure: string) => string;
};

const intlLocale = (langue: string) => (langue === "fr" ? "fr-FR" : "en-US");

function jourLocal(date: Date, timeZone?: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function formaterHeure(
  date: Date,
  langue: string,
  timeZone?: string,
): string {
  if (langue === "fr") {
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

export function formaterJour(
  date: Date,
  langue: string,
  maintenant: Date,
  timeZone?: string,
): string {
  const memeAnnee =
    jourLocal(date, timeZone).slice(0, 4) ===
    jourLocal(maintenant, timeZone).slice(0, 4);
  return new Intl.DateTimeFormat(intlLocale(langue), {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: memeAnnee ? undefined : "numeric",
  }).format(date);
}

export function formaterDateEvenement(
  iso: string,
  langue: string,
  libelles: Libelles,
  maintenant = new Date(),
  timeZone?: string,
): string {
  const date = new Date(iso);
  const heure = formaterHeure(date, langue, timeZone);
  const jour = jourLocal(date, timeZone);
  if (jour === jourLocal(maintenant, timeZone))
    return libelles.aujourdhui(heure);
  const demain = new Date(maintenant.getTime() + 24 * 3_600_000);
  if (jour === jourLocal(demain, timeZone)) return libelles.demain(heure);
  return `${formaterJour(date, langue, maintenant, timeZone)}, ${heure}`;
}

/** Date courte pour les tableaux (« 14 oct. 2026 »). */
export function formaterDateCourte(
  iso: string,
  langue: string,
  timeZone?: string,
): string {
  return new Intl.DateTimeFormat(intlLocale(langue), {
    timeZone,
    dateStyle: "medium",
  }).format(new Date(iso));
}
