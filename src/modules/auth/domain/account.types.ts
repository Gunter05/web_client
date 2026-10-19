/** Le compte connecté, tel que l'API le décrit (l'e-mail n'est donné qu'à son titulaire). */
export type Account = {
  id: string;
  name: string;
  email: string;
  photoUrl: string | null;
  isAdmin: boolean;
};

/** Ce que l'on montre d'une autre personne : jamais son e-mail. */
export type PublicProfile = {
  id: string;
  name: string;
  photoUrl: string | null;
};

export type RegistrationData = {
  name: string;
  email: string;
  password: string;
};
