"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { AvatarProfil } from "@/shared/composants/avatar-profil";
import { Champ } from "@/shared/composants/champ";
import { useActionFormulaire } from "@/shared/hooks/use-action-formulaire";
import { useErreurs } from "@/shared/i18n/erreurs";
import type { ActionFormulaire, EtatFormulaire } from "@/shared/lib/formulaire";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

/** Profil personnel : nom et photo, affichés dans le sélecteur de profil. */
export function FormulaireProfil({
  action,
  nom,
  photo,
}: {
  action: ActionFormulaire;
  nom: string;
  photo: string | null;
}) {
  const t = useTranslations();
  const erreurs = useErreurs();
  const {
    etat,
    onSubmit,
    enCours,
    action: envoyer,
  } = useActionFormulaire<EtatFormulaire>(action, {});
  const [apercu, setApercu] = useState(photo);
  const [nomSaisi, setNomSaisi] = useState(nom);
  return (
    <form
      action={envoyer}
      onSubmit={onSubmit}
      className="grid gap-5"
      noValidate
    >
      <div className="flex items-center gap-4">
        <AvatarProfil nom={nomSaisi || "?"} photo={apercu} taille="lg" />
        <Champ
          id="photo"
          libelle={t("commun.photo")}
          erreur={erreurs(etat.champs?.photo)}
          aide={t("commun.formatsPhoto")}
          className="flex-1"
        >
          <Input
            id="photo"
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const fichier = e.target.files?.[0];
              if (fichier) setApercu(URL.createObjectURL(fichier));
            }}
          />
        </Champ>
      </div>
      <Champ
        id="nom"
        libelle={t("identite.nom")}
        erreur={erreurs(etat.champs?.nom)}
      >
        <Input
          id="nom"
          name="nom"
          value={nomSaisi}
          onChange={(e) => setNomSaisi(e.target.value)}
          aria-invalid={!!etat.champs?.nom}
        />
      </Champ>
      <Button type="submit" disabled={enCours} className="justify-self-start">
        {t("commun.enregistrer")}
      </Button>
    </form>
  );
}
