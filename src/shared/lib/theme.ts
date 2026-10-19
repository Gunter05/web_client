/**
 * Thème de l'interface (ADR 0006) : « system » suit le réglage de l'appareil,
 * « light » et « dark » l'imposent. Le choix est mémorisé dans ce navigateur
 * et appliqué par la classe `dark` sur <html> (variables de globals.css).
 */
export const THEMES = ["system", "dark", "light"] as const;
export type Theme = (typeof THEMES)[number];

export const THEME_KEY = "contineng:theme";
export const THEME_EVENT = "contineng:theme";

export function isTheme(value: unknown): value is Theme {
  return THEMES.includes(value as Theme);
}

/** Thème effectif : la préférence, ou le réglage de l'appareil pour « system ». */
export function resolveTheme(theme: Theme, systemDark: boolean) {
  return theme === "system" ? (systemDark ? "dark" : "light") : theme;
}

/**
 * Script exécuté avant le premier affichage (dans <head>) : pose la classe
 * `dark` tout de suite, pour éviter un flash clair au chargement.
 */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;
