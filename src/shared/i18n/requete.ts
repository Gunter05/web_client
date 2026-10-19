import "server-only";
import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import {
  COOKIE_LANGUE,
  estLangue,
  type Langue,
  langueDepuisNavigateur,
} from "@/shared/i18n/langues";

export async function langueCourante(): Promise<Langue> {
  const choisie = (await cookies()).get(COOKIE_LANGUE)?.value;
  if (estLangue(choisie)) return choisie;
  return langueDepuisNavigateur((await headers()).get("accept-language"));
}

/** next-intl sans préfixe d'URL : les liens partagés restent identiques (ADR 0009). */
export default getRequestConfig(async () => {
  const locale = await langueCourante();
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
