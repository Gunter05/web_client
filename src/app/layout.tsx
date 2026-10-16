import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { Suspense } from "react";
import { clientEnv } from "@/shared/config/env.client";
import { Toaster } from "@/shared/ui/sonner";
import { LangueDocument } from "./_components/langue-document";
import { WebVitals } from "./_components/web-vitals";
import "./globals.css";

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
};

/**
 * La langue (cookie) et la session sont lues à la requête : avec Cache
 * Components, tout ce qui en dépend s'affiche derrière ce Suspense.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <WebVitals />
        <Suspense>
          <NextIntlClientProvider>
            <LangueDocument />
            {children}
            <Toaster position="top-center" />
          </NextIntlClientProvider>
        </Suspense>
      </body>
    </html>
  );
}
