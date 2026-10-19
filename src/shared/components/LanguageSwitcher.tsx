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
      onClick={() =>
        startTransition(async () => {
          await changeLocale(autre);
          router.refresh();
        })
      }
    >
      <LanguagesIcon /> {autre === "fr" ? t("french") : t("english")}
    </Button>
  );
}
