"use client";

import { useTranslations } from "next-intl";
import { Champ } from "@/shared/components/Champ";
import { useActionFormulaire } from "@/shared/hooks/useActionFormulaire";
import { useErreurs } from "@/shared/i18n/erreurs";
import type { ActionFormulaire, EtatFormulaire } from "@/shared/lib/formulaire";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

export function FormulaireConnexion({
  action,
  retour = "/",
}: {
  action: ActionFormulaire;
  retour?: string;
}) {
  const t = useTranslations("identite");
  const erreurs = useErreurs();
  const {
    etat,
    onSubmit,
    enCours,
    action: envoyer,
  } = useActionFormulaire<EtatFormulaire>(action, {});
  return (
    <form
      action={envoyer}
      onSubmit={onSubmit}
      className="grid gap-4"
      noValidate
    >
      <input type="hidden" name="retour" value={retour} />
      <Champ id="email" libelle={t("email")}>
        <Input id="email" name="email" type="email" autoComplete="email" />
      </Champ>
      <Champ id="motDePasse" libelle={t("motDePasse")}>
        <Input
          id="motDePasse"
          name="motDePasse"
          type="password"
          autoComplete="current-password"
        />
      </Champ>
      {etat.erreur && (
        <p role="alert" className="text-sm text-destructive">
          {erreurs(etat.erreur)}
        </p>
      )}
      <Button type="submit" size="lg" disabled={enCours} className="w-full">
        {t("seConnecter")}
      </Button>
    </form>
  );
}
