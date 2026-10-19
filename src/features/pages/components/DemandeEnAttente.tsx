"use client";

import { ClockIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useTransition } from "react";
import { useMonte } from "@/shared/hooks/useMonte";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

/** Demande en attente, que l'utilisateur peut retirer (US-03). */
export function DemandeEnAttente({
  nom,
  envoyeeLe,
  retirer,
}: {
  nom: string;
  envoyeeLe: string;
  retirer: () => Promise<void>;
}) {
  const t = useTranslations();
  const format = useFormatter();
  const monte = useMonte();
  const [enCours, demarrer] = useTransition();
  return (
    <div className="grid gap-4 rounded-xl border p-5">
      <Badge variant="secondary" className="w-fit gap-1">
        <ClockIcon className="size-3" /> {t("pages.demande.enAttente")}
      </Badge>
      <p className="text-sm">
        {t("pages.demande.enAttenteDetail", {
          nom,
          date: monte
            ? format.dateTime(new Date(envoyeeLe), {
                dateStyle: "long",
                timeStyle: "short",
              })
            : "…",
        })}
      </p>
      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button
              variant="outline"
              disabled={enCours}
              className="justify-self-start"
            />
          }
        >
          {t("pages.demande.retirer")}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("pages.demande.retirerConfirmation")}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("commun.annuler")}</AlertDialogCancel>
            <AlertDialogAction onClick={() => demarrer(retirer)}>
              {t("commun.confirmer")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
