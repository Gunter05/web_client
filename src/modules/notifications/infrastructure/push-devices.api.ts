import "server-only";
import { cookies } from "next/headers";
import { api } from "@/shared/api/client";
import { env } from "@/shared/config/env";
import type { Locale } from "@/shared/i18n/locales";

/**
 * Appareil de ce navigateur, retenu dans un cookie httpOnly pour l'oublier à
 * la déconnexion, même sans JavaScript (le FID n'est pas un secret).
 */
const COOKIE = "contineng_push";
const ONE_YEAR = 60 * 60 * 24 * 365;

const path = (installationId: string) =>
  `/api/v1/me/push-devices/${encodeURIComponent(installationId)}`;

/**
 * Client des appareils push de l'API (ADR 0016 du backend). Le contrat est en
 * anglais : la requête est envoyée telle quelle.
 */
export const pushDevicesApi = {
  register: async (installationId: string, language: Locale) => {
    await api<void>(path(installationId), {
      method: "PUT",
      body: { platform: "web", language },
    });
    (await cookies()).set(COOKIE, installationId, {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      path: "/",
      maxAge: ONE_YEAR,
    });
  },
  unregister: async (installationId: string) => {
    await api<void>(path(installationId), { method: "DELETE" });
    (await cookies()).delete(COOKIE);
  },
  /** Oublie l'appareil de ce navigateur, s'il en a un (déconnexion). */
  forgetThisBrowser: async () => {
    const installationId = (await cookies()).get(COOKIE)?.value;
    if (!installationId) return;
    await pushDevicesApi.unregister(installationId).catch(() => undefined);
  },
};
