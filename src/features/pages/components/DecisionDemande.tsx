"use client";

import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";
import { Champ } from "@/shared/components/Champ";
import { useActionFormulaire } from "@/shared/hooks/useActionFormulaire";
import { useErreurs } from "@/shared/i18n/erreurs";
import type { ActionFormulaire, EtatFormulaire } from "@/shared/lib/formulaire";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";

/** Accepter, ou refuser avec un motif d'au moins 10 caractères (US-03). */
export function DecisionDemande({
  demandeId,
  accepter,
  refuser,
}: {
  demandeId: string;
  accepter: () => Promise<{ erreur?: string } | void>;
  refuser: ActionFormulaire;
}) {
  const t = useTranslations();
  const erreurs = useErreurs();
  const [enCours, demarrer] = useTransition();
  const refus = useActionFormulaire<EtatFormulaire>(refuser, {});
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        disabled={enCours}
        onClick={() =>
          demarrer(async () => {
            const r = await accepter();
            if (r?.erreur) toast.error(erreurs(r.erreur));
          })
        }
      >
        {t("admin.demandes.accepter")}
      </Button>
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          {t("admin.demandes.refuser")}
        </DialogTrigger>
        <DialogContent>
          <form
            action={refus.action}
            onSubmit={refus.onSubmit}
            className="grid gap-4"
            noValidate
          >
            <DialogHeader>
              <DialogTitle>{t("admin.demandes.refuser")}</DialogTitle>
            </DialogHeader>
            <input type="hidden" name="demandeId" value={demandeId} />
            <Champ
              id="motif"
              libelle={t("admin.demandes.motifRefus")}
              erreur={erreurs(refus.etat.champs?.motif)}
            >
              <Textarea
                id="motif"
                name="motif"
                rows={3}
                aria-invalid={!!refus.etat.champs?.motif}
              />
            </Champ>
            {refus.etat.erreur && !refus.etat.champs && (
              <p role="alert" className="text-sm text-destructive">
                {erreurs(refus.etat.erreur)}
              </p>
            )}
            <DialogFooter>
              <Button
                type="submit"
                variant="destructive"
                disabled={refus.enCours}
              >
                {t("admin.demandes.refuser")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
