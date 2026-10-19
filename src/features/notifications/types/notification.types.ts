/** Le type est la clé du message dans le catalogue `notifications.*`. */
export type TypeNotification =
  | "pageCreee"
  | "demandeRefusee"
  | "accesDonne"
  | "accesRetire"
  | "nouvelleDemande";

/** Notification dans l'application, produite par l'API (US-03, US-06). */
export type Notification = {
  id: string;
  type: TypeNotification;
  parametres: Record<string, string>;
  /** Lien ouvert au clic. */
  lien: string | null;
  lue: boolean;
  creeLe: string;
};
