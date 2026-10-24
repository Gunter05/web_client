"use client";

import { MagnifyingGlassIcon, XIcon } from "@/shared/components/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { cn } from "@/shared/lib/utils";
import { SEARCH_MAX_LENGTH } from "@/modules/events/domain/search";

/**
 * Champ de recherche façon Instagram (Explorer). La saisie est reprise dans
 * l'adresse (`?q=`) après une courte pause, pour qu'une recherche se partage.
 */
export function SearchBar({ value }: { value: string }) {
  const t = useTranslations("search");
  const router = useRouter();
  const path = usePathname();
  const params = useSearchParams();
  const [text, setText] = useState(value);
  const [enCours, startTransition] = useTransition();

  useEffect(() => {
    if (text.trim() === (params.get("q") ?? "")) return;
    const timer = setTimeout(() => {
      const nextEvents = new URLSearchParams(params);
      if (text.trim()) nextEvents.set("q", text.trim());
      else nextEvents.delete("q");
      const query = nextEvents.toString().replaceAll("%2C", ",");
      startTransition(() =>
        router.replace(query ? `${path}?${query}` : path, {
          scroll: false,
        }),
      );
    }, 300);
    return () => clearTimeout(timer);
  }, [text, params, path, router]);

  return (
    <div role="search" className="relative">
      <MagnifyingGlassIcon
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="search"
        value={text}
        maxLength={SEARCH_MAX_LENGTH}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("placeholder")}
        aria-label={t("placeholder")}
        aria-busy={enCours}
        autoComplete="off"
        className={cn(
          "h-10 w-full rounded-full bg-muted pr-10 pl-10 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-search-cancel-button]:hidden",
        )}
      />
      {text && (
        <button
          type="button"
          onClick={() => setText("")}
          aria-label={t("clear")}
          className="absolute top-1/2 right-3 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground"
        >
          <XIcon className="size-4" />
        </button>
      )}
    </div>
  );
}
