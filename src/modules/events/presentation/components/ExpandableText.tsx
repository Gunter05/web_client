"use client";

import { useTranslations } from "next-intl";
import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";

const CLAMP = { 2: "line-clamp-2", 4: "line-clamp-4", 6: "line-clamp-6" };

/**
 * Début d'un texte sur quelques lignes, puis « voir plus » qui déplie le
 * reste sur place. Le lien n'apparaît que si le texte est réellement coupé.
 */
export function ExpandableText({
  text,
  lines = 4,
  className,
}: {
  text: string;
  lines?: keyof typeof CLAMP;
  className?: string;
}) {
  const t = useTranslations("events");
  const ref = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(false);

  // Coupé si le contenu dépasse la hauteur visible ; remesuré si la largeur change
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || expanded) return;
    const measure = () =>
      setClamped(element.scrollHeight > element.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [text, expanded]);

  return (
    <div className={className}>
      <p
        ref={ref}
        className={cn(
          "leading-relaxed whitespace-pre-line",
          !expanded && CLAMP[lines],
        )}
      >
        {text}
      </p>
      {clamped && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="font-medium text-muted-foreground hover:text-foreground hover:underline focus-visible:underline focus-visible:outline-none"
        >
          {t("seeMore")}
        </button>
      )}
    </div>
  );
}
