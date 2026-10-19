import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import {
  clientSchema,
  serverSchema,
  valider,
} from "./src/shared/config/schema";

valider(serverSchema, process.env);
valider(clientSchema, process.env);

// Mode « observation » : le navigateur signale les violations sans rien bloquer.
// Une CSP stricte à nonce rendrait toutes les pages dynamiques (voir ADR 0008).
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const enTetesDeSecurite = [
  { key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  poweredByHeader: false,
  // Le sélecteur de profil occupe le coin bas gauche (US-37).
  devIndicators: { position: "bottom-right" },
  experimental: {
    // Photos d'événement jusqu'à 5 Mo (US-11), envoyées par Server Action.
    serverActions: { bodySizeLimit: "6mb" },
  },
  images: {
    // Aucun domaine externe autorisé tant qu'on n'en a pas besoin.
    remotePatterns: [],
  },
  // Les photos sont servies par l'API : même origine pour le navigateur.
  async rewrites() {
    return [
      {
        source: "/api/v1/medias/:id",
        destination: `${process.env.API_URL ?? "http://localhost:8080"}/api/v1/medias/:id`,
      },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: enTetesDeSecurite }];
  },
};

// Interface FR/EN sans préfixe d'URL (ADR 0009).
export default createNextIntlPlugin("./src/shared/i18n/requete.ts")(nextConfig);
