"use client";

import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { type RefObject, useEffect, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { ShareIconButton } from "@/modules/events/presentation/components/ShareButton";

const CIRCLE =
  "ct-press grid size-11 place-items-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:size-5";

/**
 * Barre de la fiche sur téléphone : transparente sur la photo, elle ne montre
 * que deux cercles de verre (retour, partage) ; une fois la photo dépassée,
 * elle devient une barre opaque et les cercles aussi. Un IntersectionObserver
 * suit la photo.
 */
export function EventHeroBar({
  hero,
  path,
  title,
  onShare,
}: {
  hero: RefObject<HTMLElement | null>;
  path: string;
  title: string;
  onShare?: () => Promise<void>;
}) {
  const t = useTranslations("common");
  const router = useRouter();
  const [overImage, setOverImage] = useState(true);

  useEffect(() => {
    const target = hero.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOverImage(entry?.isIntersecting ?? false),
      { rootMargin: "-64px 0px 0px 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hero]);

  const circle = cn(CIRCLE, overImage ? "ct-glass" : "bg-secondary");

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-0 z-30 flex items-center justify-between px-3 pt-[calc(env(safe-area-inset-top)+0.5rem)] pb-2 transition-colors md:hidden",
        !overImage && "ct-bar",
      )}
    >
      <button
        type="button"
        aria-label={t("back")}
        onClick={() => (history.length > 1 ? router.back() : router.push("/"))}
        className={circle}
      >
        <ChevronLeftIcon className="-translate-x-px" />
      </button>
      <ShareIconButton
        path={path}
        title={title}
        text={title}
        onShare={onShare}
        className={circle}
      />
    </div>
  );
}
