"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { AvatarProfil } from "@/shared/composants/avatar-profil";
import { Button } from "@/shared/ui/button";
import type { ChoisirProfil } from "./selecteur-profil";

/** « Vous agissez au nom de [page] » (US-37). */
export function BandeauPageActive({
  nom,
  photo,
  choisir,
}: {
  nom: string;
  photo: string | null;
  choisir: ChoisirProfil;
}) {
  const t = useTranslations("profilActif");
  const router = useRouter();
  const [enCours, demarrer] = useTransition();
  return (
    <div
      role="status"
      className="flex items-center gap-2 border-b bg-avertissement-fond px-4 py-2 text-sm"
    >
      <AvatarProfil nom={nom} photo={photo} taille="xs" />
      <p className="min-w-0 flex-1 truncate">{t("bandeau", { page: nom })}</p>
      <Button
        variant="ghost"
        size="sm"
        disabled={enCours}
        className="shrink-0"
        onClick={() =>
          demarrer(async () => {
            await choisir(null);
            router.refresh();
          })
        }
      >
        {t("revenirPersonnel")}
      </Button>
    </div>
  );
}
