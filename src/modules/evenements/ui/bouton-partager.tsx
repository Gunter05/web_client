"use client";

import { Button } from "@/shared/ui/button";
import { SendIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

/**
 * « Partager » (US-36) : menu de partage du téléphone s'il existe, sinon copie
 * du lien. Le lien porte `?via=partage` pour mesurer les arrivées par lien partagé.
 */
export function BoutonPartager({
  url,
  titre,
  texte,
  onPartage,
  className,
}: {
  url: string;
  titre: string;
  texte: string;
  onPartage?: () => Promise<void>;
  className?: string;
}) {
  const t = useTranslations("partage");
  const lien = `${url}?via=partage`;
  async function partager() {
    void onPartage?.();
    if (navigator.share) {
      try {
        await navigator.share({ title: titre, text: texte, url: lien });
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
      }
    }
    await navigator.clipboard.writeText(lien);
    toast.success(t("lienCopie"));
  }
  return (
    <Button onClick={partager} className={className}>
      <SendIcon /> {t("partager")}
    </Button>
  );
}
