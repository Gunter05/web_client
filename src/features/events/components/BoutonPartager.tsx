"use client";

import { SendIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";

type Partage = {
  /** Adresse de la fiche ; par défaut, construite depuis l'origine du site. */
  url?: string;
  chemin?: string;
  titre: string;
  texte: string;
  onPartage?: () => Promise<void>;
};

/**
 * « Partager » (US-36) : menu de partage du téléphone s'il existe, sinon copie
 * du lien. Le lien porte `?via=partage` pour mesurer les arrivées par lien partagé.
 */
function usePartager({ url, chemin, titre, texte, onPartage }: Partage) {
  const t = useTranslations("partage");
  return async function partager() {
    const base = url ?? `${window.location.origin}${chemin ?? ""}`;
    const lien = `${base}?via=partage`;
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
  };
}

export function BoutonPartager({
  className,
  ...partage
}: Partage & { className?: string }) {
  const t = useTranslations("partage");
  const partager = usePartager(partage);
  return (
    <Button onClick={partager} className={className}>
      <SendIcon /> {t("partager")}
    </Button>
  );
}

/** Variante icône seule, comme l'avion en papier d'Instagram sous une publication. */
export function IconePartager({
  className,
  ...partage
}: Partage & { className?: string }) {
  const t = useTranslations("partage");
  const partager = usePartager(partage);
  return (
    <button
      type="button"
      onClick={partager}
      aria-label={t("partager")}
      title={t("partager")}
      className={cn(
        "grid size-10 place-items-center rounded-full outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:size-6",
        className,
      )}
    >
      <SendIcon />
    </button>
  );
}
