/** Langue de l'interface (`fr` ou `en`, comme `LOCALES` de `shared/i18n`). */
type Language = "fr" | "en";

/** Son propre profil : ce que l'on montre de soi, et sa langue préférée. */
export type MyProfile = {
  id: string;
  name: string;
  photoUrl: string | null;
  language: Language;
};

/** Ce que l'on montre d'une autre personne : jamais son e-mail. */
export type PublicProfile = {
  id: string;
  name: string;
  photoUrl: string | null;
};
