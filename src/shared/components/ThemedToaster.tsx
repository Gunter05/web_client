"use client";

import { useTheme } from "@/shared/hooks/useTheme";
import { Toaster } from "@/shared/ui/sonner";

/**
 * Toasts au thème de l'interface. Monté une fois pour toute l'application, il
 * garde aussi la classe `dark` à jour quand l'appareil change de réglage.
 */
export function ThemedToaster() {
  const { resolved } = useTheme();
  return <Toaster position="top-center" theme={resolved} />;
}
