import "server-only";
import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import {
  LOCALE_COOKIE,
  isLocale,
  type Locale,
  localeFromBrowser,
} from "@/shared/i18n/locales";

export async function currentLocale(): Promise<Locale> {
  const chosen = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(chosen)) return chosen;
  return localeFromBrowser((await headers()).get("accept-language"));
}

/** next-intl sans préfixe d'URL : les liens partagés restent identiques (ADR 0009). */
export default getRequestConfig(async () => {
  const locale = await currentLocale();
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
