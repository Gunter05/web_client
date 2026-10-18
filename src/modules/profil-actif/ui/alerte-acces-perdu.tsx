"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { toast } from "sonner";

/** Message affiché une fois quand l'accès à la page active a été retiré (US-37). */
export function AlerteAccesPerdu({
  nom,
  oublier,
}: {
  nom: string | null;
  /** Efface la page active mémorisée, pour ne prévenir qu'une fois. */
  oublier: () => Promise<unknown>;
}) {
  const t = useTranslations("profilActif");
  useEffect(() => {
    if (!nom) return;
    toast.warning(t("accesPerdu", { nom }));
    void oublier();
  }, [nom, oublier, t]);
  return null;
}
