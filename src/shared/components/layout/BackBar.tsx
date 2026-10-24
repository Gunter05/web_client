"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

/**
 * Barre de retour des pages plein écran sur téléphone : revient à la page
 * précédente du site, comme le retour natif. Arrivé par un lien partagé (pas
 * de page précédente du site), elle mène à `fallback`.
 */
export function BackBar({
  title,
  fallback = "/",
}: {
  title?: string;
  fallback?: string;
}) {
  const t = useTranslations("common");
  const router = useRouter();
  function back() {
    const fromSite =
      document.referrer.startsWith(window.location.origin) &&
      window.history.length > 1;
    if (fromSite) router.back();
    else router.push(fallback);
  }
  return (
    <div className="sticky top-0 z-30 flex h-12 items-center gap-1 border-b bg-background/95 px-1 backdrop-blur md:hidden">
      <button
        type="button"
        onClick={back}
        aria-label={t("back")}
        className="grid size-10 place-items-center rounded-full hover:bg-muted [&_svg]:size-5"
      >
        <ArrowLeftIcon />
      </button>
      {title && <p className="truncate text-sm font-semibold">{title}</p>}
    </div>
  );
}
