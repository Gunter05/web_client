"use client";

import { useTranslations } from "next-intl";
import { Champ } from "@/shared/components/Champ";
import { useActionFormulaire } from "@/shared/hooks/useActionFormulaire";
import { useErreurs } from "@/shared/i18n/erreurs";
import type { ActionFormulaire, EtatFormulaire } from "@/shared/lib/formulaire";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

export function FormulaireInscription({
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
  const c = etat.champs ?? {};
  return (
    <form
      action={envoyer}
      onSubmit={onSubmit}
      className="grid gap-4"
      noValidate
    >
      <input type="hidden" name="retour" value={retour} />
      <Champ id="nom" libelle={t("nom")} erreur={erreurs(c.nom)}>
        <Input id="nom" name="nom" autoComplete="name" aria-invalid={!!c.nom} />
      </Champ>
      <Champ id="email" libelle={t("email")} erreur={erreurs(c.email)}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!c.email}
        />
      </Champ>
      <Champ
        id="motDePasse"
        libelle={t("motDePasse")}
        erreur={erreurs(c.motDePasse)}
      >
        <Input
          id="motDePasse"
          name="motDePasse"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!c.motDePasse}
        />
      </Champ>
      <Button type="submit" size="lg" disabled={enCours} className="w-full">
        {t("sInscrire")}
      </Button>
    </form>
  );
}
