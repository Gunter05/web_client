/** Le compte connecté, tel que l'API le décrit (l'e-mail n'est donné qu'à son titulaire). */
export type Compte = {
  id: string;
  nom: string;
  email: string;
  photo: string | null;
  estAdmin: boolean;
};

/** Ce que l'on montre d'une autre personne : jamais son e-mail. */
export type ProfilPersonnel = { id: string; nom: string; photo: string | null };

export type DonneesInscription = {
  nom: string;
  email: string;
  motDePasse: string;
};
