"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

/**
 * Affiche un message de confirmation transmis par `?msg=` après une
 * redirection, puis retire le paramètre pour garder un lien propre à partager.
 */
export function ToastDepuisUrl({
  messages,
}: {
  messages: Record<string, string>;
}) {
  const params = useSearchParams();
  const router = useRouter();
  const chemin = usePathname();
  const cle = params.get("msg");
  useEffect(() => {
    if (!cle) return;
    const message = messages[cle];
    if (message) toast.success(message);
    const reste = new URLSearchParams(params);
    reste.delete("msg");
    router.replace(reste.size ? `${chemin}?${reste}` : chemin, {
      scroll: false,
    });
  }, [cle, messages, params, router, chemin]);
  return null;
}
