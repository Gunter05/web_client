import type { NextConfig } from "next";
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
  images: {
    // Aucun domaine externe autorisé tant qu'on n'en a pas besoin.
    remotePatterns: [],
  },
  async headers() {
    return [{ source: "/:path*", headers: enTetesDeSecurite }];
  },
};

export default nextConfig;
