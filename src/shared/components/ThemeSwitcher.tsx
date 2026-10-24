"use client";

import {
  MoonIcon,
  SlidersHorizontalIcon,
  SunIcon,
} from "@/shared/components/icons";
import { useTranslations } from "next-intl";
import { useTheme } from "@/shared/hooks/useTheme";
import { useMounted } from "@/shared/hooks/useMounted";
import { cn } from "@/shared/lib/utils";
import type { Theme } from "@/shared/lib/theme";

const ICONS = {
  system: SlidersHorizontalIcon,
  dark: MoonIcon,
  light: SunIcon,
} satisfies Record<Theme, unknown>;

/** Sélecteur Système / Sombre / Clair, en pastilles groupées. */
export function ThemeSwitcher({ className }: { className?: string }) {
  const t = useTranslations("theme");
  const { theme, setTheme } = useTheme();
  // La préférence n'est connue que dans le navigateur.
  const mounted = useMounted();

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={cn("flex rounded-full bg-muted p-0.5", className)}
    >
      {(Object.keys(ICONS) as Theme[]).map((value) => {
        const Icon = ICONS[value];
        const active = mounted && theme === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            aria-label={t(value)}
            title={t(value)}
            onClick={() => setTheme(value)}
            className={cn(
              "grid size-8 place-items-center rounded-full text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
              active && "bg-background text-foreground shadow-xs",
            )}
          >
            <Icon className="size-4" />
          </button>
        );
      })}
    </div>
  );
}
