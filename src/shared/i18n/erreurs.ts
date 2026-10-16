"use client";

import { useTranslations } from "next-intl";

/** Traduit un code d'erreur du domaine (`erreurs.*`), avec repli générique. */
export function useErreurs() {
  const t = useTranslations("erreurs");
  return (code: string | undefined | null) => {
    if (!code) return null;
    return t.has(code as "inconnue") ? t(code as "inconnue") : t("inconnue");
  };
}
