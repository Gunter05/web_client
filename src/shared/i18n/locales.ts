export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const LOCALE_COOKIE = "NEXT_LOCALE";

/** D2 : français si le navigateur le préfère, sinon anglais. */
export function localeFromBrowser(acceptLanguage: string | null): Locale {
  const first = acceptLanguage?.split(",")[0]?.trim().toLowerCase() ?? "";
  return first.startsWith("fr") ? "fr" : "en";
}

export function isLocale(value: string | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}
