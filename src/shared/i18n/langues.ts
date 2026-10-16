export const LANGUES = ["fr", "en"] as const;
export type Langue = (typeof LANGUES)[number];
export const COOKIE_LANGUE = "NEXT_LOCALE";

/** D2 : français si le navigateur le préfère, sinon anglais. */
export function langueDepuisNavigateur(acceptLanguage: string | null): Langue {
  const premiere = acceptLanguage?.split(",")[0]?.trim().toLowerCase() ?? "";
  return premiere.startsWith("fr") ? "fr" : "en";
}

export function estLangue(valeur: string | undefined): valeur is Langue {
  return LANGUES.includes(valeur as Langue);
}
