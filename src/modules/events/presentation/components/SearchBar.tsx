"use client";

import { MagnifyingGlassIcon, XIcon } from "@/shared/components/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { cn } from "@/shared/lib/utils";
import { SEARCH_MAX_LENGTH } from "@/modules/events/domain/search";

/**
 * Champ de recherche façon Instagram (Explorer). La recherche part à la
 * validation (Entrée, touche « Rechercher » du clavier mobile) et non à
 * chaque frappe : une seule requête par recherche. Elle est reprise dans
 * l'adresse (`?q=`) pour qu'une recherche se partage.
 */
export function SearchBar({ value }: { value: string }) {
  const t = useTranslations("search");
  const router = useRouter();
  const path = usePathname();
  const params = useSearchParams();
  const [text, setText] = useState(value);
  const [enCours, startTransition] = useTransition();

  function search(query: string) {
    if (query === (params.get("q") ?? "")) return;
    const next = new URLSearchParams(params);
    if (query) next.set("q", query);
    else next.delete("q");
    const address = next.toString().replaceAll("%2C", ",");
    startTransition(() =>
      router.replace(address ? `${path}?${address}` : path, { scroll: false }),
    );
  }

  return (
    <form
      role="search"
      className="relative"
      onSubmit={(e) => {
        e.preventDefault();
        search(text.trim());
      }}
    >
      <MagnifyingGlassIcon
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="search"
        name="q"
        value={text}
        maxLength={SEARCH_MAX_LENGTH}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("placeholder")}
        aria-label={t("placeholder")}
        aria-busy={enCours}
        autoComplete="off"
        enterKeyHint="search"
        className={cn(
          "h-10 w-full rounded-full bg-muted pr-10 pl-10 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-search-cancel-button]:hidden",
        )}
      />
      {text && (
        <button
          type="button"
          onClick={() => {
            // Effacer revient à la liste complète, sans attendre une validation.
            setText("");
            search("");
          }}
          aria-label={t("clear")}
          className="absolute top-1/2 right-3 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground"
        >
          <XIcon className="size-4" />
        </button>
      )}
    </form>
  );
}
