"use client";

import { useTranslations } from "next-intl";
import { Champ } from "@/shared/components/Champ";
import { useActionFormulaire } from "@/shared/hooks/useActionFormulaire";
import { useErreurs } from "@/shared/i18n/erreurs";
import type { ActionFormulaire, EtatFormulaire } from "@/shared/lib/formulaire";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { TYPES_ORGANISATION } from "@/features/pages/types/page.types";

/** Formulaire « Créer une page » (US-03). */
export function FormulaireDemande({ action }: { action: ActionFormulaire }) {
  const t = useTranslations();
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
      className="grid gap-5"
      noValidate
    >
      <Champ id="nom" libelle={t("pages.demande.nom")} erreur={erreurs(c.nom)}>
        <Input id="nom" name="nom" maxLength={60} aria-invalid={!!c.nom} />
      </Champ>
      <Champ
        id="type"
        libelle={t("pages.demande.type")}
        erreur={erreurs(c.type)}
      >
        <select
          id="type"
          name="type"
          defaultValue=""
          aria-invalid={!!c.type}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive"
        >
          <option value="" disabled>
            {t("pages.demande.choisirType")}
          </option>
          {TYPES_ORGANISATION.map((type) => (
            <option key={type} value={type}>
              {t(`pages.types.${type}`)}
            </option>
          ))}
        </select>
      </Champ>
      <Champ
        id="description"
        libelle={t("pages.demande.description")}
        erreur={erreurs(c.description)}
      >
        <Textarea
          id="description"
          name="description"
          maxLength={500}
          rows={3}
          aria-invalid={!!c.description}
        />
      </Champ>
      <Champ
        id="photo"
        libelle={t("commun.photoFacultative")}
        erreur={erreurs(c.photo)}
        aide={t("commun.formatsPhoto")}
      >
        <Input
          id="photo"
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
        />
      </Champ>
      <Champ
        id="justification"
        libelle={t("pages.demande.justification")}
        erreur={erreurs(c.justification)}
        aide={t("pages.demande.aideJustification")}
      >
        <Textarea
          id="justification"
          name="justification"
          maxLength={500}
          rows={3}
          aria-invalid={!!c.justification}
        />
      </Champ>
      {etat.erreur && !etat.champs && (
        <p role="alert" className="text-sm text-destructive">
          {erreurs(etat.erreur)}
        </p>
      )}
      <Button type="submit" disabled={enCours} className="justify-self-start">
        {t("commun.envoyer")}
      </Button>
    </form>
  );
}
