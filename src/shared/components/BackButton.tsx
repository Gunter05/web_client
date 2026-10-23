"use client";

import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { buttonVariants } from "@/shared/components/Button";
import { cn } from "@/shared/lib/utils";

/**
 * Cercle de verre « Retour », posé sur une photo ou une couverture : revient
 * à la page précédente, ou à l'accueil si on est arrivé directement.
 */
export function BackButton({ className }: { className?: string }) {
  const t = useTranslations("common");
  const router = useRouter();
  return (
    <button
      type="button"
      aria-label={t("back")}
      onClick={() => (history.length > 1 ? router.back() : router.push("/"))}
      className={cn(buttonVariants({ variant: "glass-circle" }), className)}
    >
      <ChevronLeftIcon className="-translate-x-px" />
    </button>
  );
}
