"use client";

import { LanguagesIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { changerLangue } from "@/shared/i18n/actions";
import { Button } from "@/shared/components/ui/button";

/** Bascule FR/EN depuis l'en-tête, mémorisée dans un cookie (D2). */
export function SelecteurLangue({ className }: { className?: string }) {
  const langue = useLocale();
  const t = useTranslations("commun");
  const router = useRouter();
  const [enCours, demarrer] = useTransition();
  const autre = langue === "fr" ? "en" : "fr";
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={enCours}
      className={className}
      lang={autre}
      onClick={() =>
        demarrer(async () => {
          await changerLangue(autre);
          router.refresh();
        })
      }
    >
      <LanguagesIcon /> {autre === "fr" ? t("francais") : t("anglais")}
    </Button>
  );
}
