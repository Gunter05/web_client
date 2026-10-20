import { NextIntlClientProvider } from "next-intl";
import { type ReactNode, Suspense } from "react";
import { DocumentLanguage } from "@/shared/components/DocumentLanguage";
import { ThemedToaster } from "@/shared/components/ThemedToaster";

/**
 * Providers globaux : traductions (langue lue à la requête, d'où le
 * Suspense avec Cache Components), langue du document et notifications toast (au thème de l'interface).
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <NextIntlClientProvider>
        <DocumentLanguage />
        {children}
        <ThemedToaster />
      </NextIntlClientProvider>
    </Suspense>
  );
}
