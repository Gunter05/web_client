import { pushServiceWorker } from "@/modules/notifications/server";

/** Service worker de Firebase Cloud Messaging, à la racine du site (ADR 0017). */
export function GET() {
  const script = pushServiceWorker();
  if (!script) return new Response(null, { status: 404 });
  return new Response(script, {
    headers: {
      "Content-Type": "text/javascript; charset=utf-8",
      // Une nouvelle version du site doit remplacer l'ancien service worker.
      "Cache-Control": "no-cache",
    },
  });
}
