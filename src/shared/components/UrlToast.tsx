"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

/**
 * Affiche un message de confirmation transmis par `?msg=` après une
 * redirection, puis retire le paramètre pour garder un lien propre à partager.
 */
export function UrlToast({ messages }: { messages: Record<string, string> }) {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const key = params.get("msg");
  useEffect(() => {
    if (!key) return;
    const message = messages[key];
    if (message) toast.success(message);
    const rest = new URLSearchParams(params);
    rest.delete("msg");
    router.replace(rest.size ? `${path}?${rest}` : path, {
      scroll: false,
    });
  }, [key, messages, params, router, path]);
  return null;
}
