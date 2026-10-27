"use client";

import { ArrowLeftIcon } from "@/shared/components/icons";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

/**
 * Barre de retour des pages plein écran sur téléphone : revient à la page
 * précédente du site, comme le retour natif. Arrivé par un lien partagé (pas
 * de page précédente du site), elle mène à `fallback`.
 *
 * Arrivé par un lien dans un onglet neuf (WhatsApp…), le fil est glissé sous
 * la page dans l'historique : le retour du téléphone y mène au lieu de
 * quitter le site.
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
  useEffect(() => {
    if (window.history.length !== 1) return;
    const here = window.location.href;
    const state: unknown = window.history.state;
    // `_N` sans `__NA` : Next.js ne suit pas cette entrée et recharge
    // `fallback` quand on y revient.
    window.history.replaceState({ _N: true }, "", fallback);
    window.history.pushState(state, "", here);
  }, [fallback]);
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
