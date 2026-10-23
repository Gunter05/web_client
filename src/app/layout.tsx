import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { clientEnv } from "@/shared/config/env.client";
import { WebVitals } from "@/shared/components/WebVitals";
import { THEME_SCRIPT } from "@/shared/lib/theme";
import { env } from "@/shared/config/env";
import { PUBLIC_IMAGE_HOST } from "@/modules/events";
import { Providers } from "./providers";
import "./globals.css";

/**
 * Inter, repli de la police système d'Apple (SF Pro) : la pile complète est
 * dans --font-sans (globals.css).
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(clientEnv.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "Le Contineng",
    template: "%s · Le Contineng",
  },
  description: "Le réseau social des événements.",
  applicationName: "Le Contineng",
  // Application ajoutée à l'écran d'accueil d'un iPhone : plein écran, nom court
  appleWebApp: {
    capable: true,
    title: "Contineng",
    statusBarStyle: "default",
  },
};

/** Couleur de la barre du navigateur et de l'application installée, selon le thème. */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

/** Document racine : polices, mesures Web Vitals et providers globaux. */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      // La classe `dark` est posée par le script du thème avant React.
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Thème appliqué avant le premier affichage (pas de flash clair). */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {/* Connexion ouverte d'avance vers les serveurs d'images : la première photo arrive plus tôt */}
        {[...storageOrigins(), PUBLIC_IMAGE_HOST].map((origin) => (
          <link key={origin} rel="preconnect" href={origin} />
        ))}
      </head>
      <body className="flex min-h-full flex-col">
        <WebVitals />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

/** Origines du stockage des photos (préconnexion), lues dans la configuration. */
function storageOrigins(): string[] {
  return env.MEDIAS_STORAGE_ORIGINS.split(/[\s,]+/).filter(Boolean);
}
