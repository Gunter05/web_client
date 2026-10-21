import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { clientEnv } from "@/shared/config/env.client";
import { WebVitals } from "@/shared/components/WebVitals";
import { THEME_SCRIPT } from "@/shared/lib/theme";
import { Providers } from "./providers";
import "./globals.css";

import { Poppins } from "next/font/google";

// Configuration de la police
const poppins = Poppins({
  subsets: ["latin"], // Charge uniquement les caractères latins (plus léger)
  weight: ["400", "600", "700"], // Choisissez les poids dont vous avez besoin
  variable: "--font-poppins", // Crée une variable CSS réutilisable
});

const geistSans = Geist({
  variable: "--font-sans",
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
      className={`${poppins.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Thème appliqué avant le premier affichage (pas de flash clair). */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col">
        <WebVitals />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
