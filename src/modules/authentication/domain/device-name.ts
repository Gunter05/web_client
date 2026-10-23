/**
 * Nom lisible d'un appareil à partir de son navigateur déclaré, pour la liste
 * des appareils connectés : « Chrome · Android », « Safari · iPhone »…
 */
export function deviceName(userAgent: string | null): {
  browser: string | null;
  system: string | null;
} {
  if (!userAgent) return { browser: null, system: null };
  const ua = userAgent;
  const system = /iPhone/.test(ua)
    ? "iPhone"
    : /iPad/.test(ua)
      ? "iPad"
      : /Android/.test(ua)
        ? "Android"
        : /Windows/.test(ua)
          ? "Windows"
          : /Mac OS X|Macintosh/.test(ua)
            ? "macOS"
            : /Linux/.test(ua)
              ? "Linux"
              : null;
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\/|Opera/.test(ua)
      ? "Opera"
      : /PhoenixBrowser|Phoenix/.test(ua)
        ? "Phoenix"
        : /SamsungBrowser/.test(ua)
          ? "Samsung Internet"
          : /Firefox\//.test(ua)
            ? "Firefox"
            : /Chrome\//.test(ua)
              ? "Chrome"
              : /Safari\//.test(ua)
                ? "Safari"
                : null;
  return { browser, system };
}
