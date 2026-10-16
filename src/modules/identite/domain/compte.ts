/** Le rôle admin est porté par le compte, jamais attribué depuis l'interface. */
export type Compte = {
  id: string;
  email: string;
  nom: string;
  photo: string | null;
  motDePasseHash: string;
  estAdmin: boolean;
  creeLe: string;
};

/** Ce que le reste de l'application peut savoir d'une personne : jamais l'e-mail. */
export type ProfilPersonnel = { id: string; nom: string; photo: string | null };

export type ErreursChamps = Record<string, string>;

export function profilPublic(compte: Compte): ProfilPersonnel {
  return { id: compte.id, nom: compte.nom, photo: compte.photo };
}

export function normaliserEmail(email: string): string {
  return email.trim().toLowerCase();
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type DonneesInscription = {
  nom: string;
  email: string;
  motDePasse: string;
};

export function erreursNom(nom: string): string | null {
  const propre = nom.trim();
  if (!propre) return "obligatoire";
  if (propre.length < 2 || propre.length > 60) return "longueur";
  return null;
}

export function erreursInscription(d: DonneesInscription): ErreursChamps {
  const champs: ErreursChamps = {};
  const nom = erreursNom(d.nom);
  if (nom) champs.nom = nom;
  if (!EMAIL.test(d.email.trim())) champs.email = "emailInvalide";
  if (d.motDePasse.length < 8) champs.motDePasse = "motDePasseCourt";
  return champs;
}
