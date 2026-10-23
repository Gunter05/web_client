/** Langue de l'interface (`fr` ou `en`, comme `LOCALES` de `shared/i18n`). */
type Language = "fr" | "en";

/**
 * La personne connectée : son compte (module `authentication` de l'API) et
 * son profil (module `profiles`), réunis. L'e-mail n'est donné qu'à son
 * titulaire.
 */
export type Account = {
  id: string;
  email: string;
  emailVerified: boolean;
  isAdmin: boolean;
  name: string;
  photoUrl: string | null;
  language: Language;
};

export type RegistrationData = {
  name: string;
  email: string;
  password: string;
  language: Language;
};

/** Un appareil connecté au compte ; `current` pour celui qui fait la requête. */
export type DeviceSession = {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: string;
  lastUsedAt: string;
  current: boolean;
};

/** Longueur minimale d'un nouveau mot de passe (API : `RegistrationValidator`). */
export const PASSWORD_MIN_LENGTH = 10;
