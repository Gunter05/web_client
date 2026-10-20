"use client";

import { LanguagesIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { changeLocale } from "@/shared/i18n/actions";
import { Button } from "@/shared/ui/button";

/** Bascule FR/EN depuis l'en-tête, mémorisée dans un cookie (D2). */
export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations("common");
  const router = useRouter();
  const [enCours, startTransition] = useTransition();
  const autre = locale === "fr" ? "en" : "fr";
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={enCours}
      className={className}
      lang={autre}
      aria-label={autre === "fr" ? t("french") : t("english")}
      onClick={() =>
        startTransition(async () => {
          await changeLocale(autre);
          router.refresh();
        })
      }
    >
      <LanguagesIcon />
      {/* Sur petit écran, le code de langue suffit (pas de débordement). */}
      <span className="sm:hidden">{autre.toUpperCase()}</span>
      <span className="hidden sm:inline">
        {autre === "fr" ? t("french") : t("english")}
      </span>
    </Button>
  );
}
