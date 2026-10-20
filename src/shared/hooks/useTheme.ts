"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { useMounted } from "@/shared/hooks/useMounted";
import {
  isTheme,
  resolveTheme,
  type Theme,
  THEME_EVENT,
  THEME_KEY,
} from "@/shared/lib/theme";

const DARK_QUERY = "(prefers-color-scheme: dark)";

function readTheme(): Theme {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return isTheme(value) ? value : "system";
  } catch {
    return "system"; // Stockage indisponible : réglage de l'appareil.
  }
}

function subscribe(callback: () => void) {
  const media = matchMedia(DARK_QUERY);
  window.addEventListener("storage", callback);
  window.addEventListener(THEME_EVENT, callback);
  media.addEventListener("change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(THEME_EVENT, callback);
    media.removeEventListener("change", callback);
  };
}

/**
 * Préférence de thème et son application : la classe `dark` de <html> suit
 * la préférence, et le réglage de l'appareil quand elle vaut « system ».
 */
export function useTheme() {
  const theme = useSyncExternalStore<Theme>(
    subscribe,
    readTheme,
    () => "system",
  );
  const systemDark = useSyncExternalStore(
    subscribe,
    () => matchMedia(DARK_QUERY).matches,
    () => false,
  );

  const resolved = resolveTheme(theme, systemDark);
  // Pendant l'hydratation, la préférence n'est pas encore lue : on laisse la
  // classe posée par le script de <head> (sinon flash clair).
  const mounted = useMounted();

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle("dark", resolved === "dark");
    }
  }, [mounted, resolved]);

  const setTheme = useCallback((next: Theme) => {
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      document.documentElement.classList.toggle(
        "dark",
        resolveTheme(next, matchMedia(DARK_QUERY).matches) === "dark",
      );
      return;
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  return { theme, resolved, setTheme };
}
