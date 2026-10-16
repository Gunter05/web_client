"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";

/**
 * Aligne `<html lang>` sur la langue choisie (D2). Le layout racine reste
 * statique (Cache Components) : la langue, lue dans un cookie, n'est connue
 * qu'à la requête.
 */
export function LangueDocument() {
  const langue = useLocale();
  useEffect(() => {
    document.documentElement.lang = langue;
  }, [langue]);
  return null;
}
