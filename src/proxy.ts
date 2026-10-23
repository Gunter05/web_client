import type { NextRequest } from "next/server";
import { refreshSession } from "@/modules/authentication/proxy";

/** Renouvelle la session avant le rendu (ADR 0018). */
export function proxy(request: NextRequest) {
  return refreshSession(request);
}

export const config = {
  // Pages et Server Actions ; ni fichiers statiques, ni images, ni service worker.
  matcher: [
    "/((?!_next/static|_next/image|api/|demo/|icons/|firebase-messaging-sw\\.js|manifest\\.webmanifest|.*\\.(?:png|jpg|jpeg|svg|webp|ico|txt|xml)$).*)",
  ],
};
