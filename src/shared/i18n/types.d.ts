import type messages from "@/shared/i18n/messages/fr.json";

// Messages typés : une clé absente du catalogue est une erreur de compilation.
declare module "next-intl" {
  interface AppConfig {
    Messages: typeof messages;
    Locale: "fr" | "en";
  }
}
