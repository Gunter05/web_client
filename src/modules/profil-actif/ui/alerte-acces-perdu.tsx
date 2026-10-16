"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { toast } from "sonner";

/** Message affiché une fois quand l'accès à la page active a été retiré (US-37). */
export function AlerteAccesPerdu({ nom }: { nom: string | null }) {
  const t = useTranslations("profilActif");
  useEffect(() => {
    if (nom) toast.warning(t("accesPerdu", { nom }));
  }, [nom, t]);
  return null;
}
