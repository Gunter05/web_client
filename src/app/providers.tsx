import { NextIntlClientProvider } from "next-intl";
import { type ReactNode, Suspense } from "react";
import { DocumentLanguage } from "@/shared/components/DocumentLanguage";
import { Toaster } from "@/shared/ui/sonner";

/**
 * Providers globaux : traductions (langue lue à la requête, d'où le
 * Suspense avec Cache Components), langue du document et notifications toast.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <NextIntlClientProvider>
        <DocumentLanguage />
        {children}
        <Toaster position="top-center" />
      </NextIntlClientProvider>
    </Suspense>
  );
}
