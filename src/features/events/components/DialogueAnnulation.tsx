"use client";

import { BanIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Champ } from "@/shared/components/Champ";
import { useActionFormulaire } from "@/shared/hooks/useActionFormulaire";
import { useErreurs } from "@/shared/i18n/erreurs";
import type { ActionFormulaire, EtatFormulaire } from "@/shared/lib/formulaire";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";

/** Annulation définitive avec motif obligatoire et confirmation (US-15, D9). */
export function DialogueAnnulation({
  evenementId,
  action,
}: {
  evenementId: string;
  action: ActionFormulaire;
}) {
  const t = useTranslations();
  const erreurs = useErreurs();
  const {
    etat,
    onSubmit,
    enCours,
    action: envoyer,
  } = useActionFormulaire<EtatFormulaire>(action, {});
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="destructive" />}>
        <BanIcon /> {t("evenements.annuler")}
      </DialogTrigger>
      <DialogContent>
        <form
          action={envoyer}
          onSubmit={onSubmit}
          className="grid gap-4"
          noValidate
        >
          <DialogHeader>
            <DialogTitle>{t("evenements.annuler")}</DialogTitle>
            <DialogDescription>
              {t("evenements.confirmationAnnulation")}
            </DialogDescription>
          </DialogHeader>
          <input type="hidden" name="id" value={evenementId} />
          <Champ
            id="motif"
            libelle={t("evenements.motifAnnulation")}
            erreur={erreurs(etat.champs?.motif)}
          >
            <Textarea
              id="motif"
              name="motif"
              rows={3}
              aria-invalid={!!etat.champs?.motif}
            />
          </Champ>
          {etat.erreur && !etat.champs && (
            <p role="alert" className="text-sm text-destructive">
              {erreurs(etat.erreur)}
            </p>
          )}
          <DialogFooter>
            <Button type="submit" variant="destructive" disabled={enCours}>
              {t("commun.confirmer")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
