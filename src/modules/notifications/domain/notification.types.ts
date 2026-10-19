/** Le type est la clé du message dans le catalogue `notifications.*`. */
export type NotificationType =
  | "pageCreated"
  | "requestRejected"
  | "accessGranted"
  | "accessRevoked"
  | "newRequest";

/** Notification dans l'application, produite par l'API (US-03, US-06). */
export type Notification = {
  id: string;
  type: NotificationType;
  params: Record<string, string>;
  /** Lien ouvert au clic. */
  link: string | null;
  read: boolean;
  createdAt: string;
};
