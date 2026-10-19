"use client";

import { useTranslations } from "next-intl";

/** Traduit un code d'erreur du domaine (`erreurs.*`), avec repli générique. */
export function useErrorMessages() {
  const t = useTranslations("errors");
  return (code: string | undefined | null) => {
    if (!code) return null;
    return t.has(code as "unknown") ? t(code as "unknown") : t("unknown");
  };
}
