/** Le type est la clé du message dans le catalogue `notifications.*`. */
export type TypeNotification =
  | "pageCreee"
  | "demandeRefusee"
  | "accesDonne"
  | "accesRetire"
  | "nouvelleDemande";

export type Notification = {
  id: string;
  destinataireId: string;
  type: TypeNotification;
  params: Record<string, string>;
  /** Lien ouvert au clic. */
  lien: string | null;
  lue: boolean;
  creeLe: string;
};

export type Brouillon = Omit<Notification, "id" | "lue" | "creeLe">;

/** Faits de la plateforme qui donnent lieu à une notification (US-03, US-06). */
export type Fait =
  | { type: "demandeDeposee"; demandeId: string; nomPage: string }
  | { type: "pageAcceptee"; nomPage: string; demandeurId: string }
  | {
      type: "demandeRefusee";
      nomPage: string;
      demandeurId: string;
      motif: string;
    }
  | { type: "accesDonne"; nomPage: string; compteId: string }
  | { type: "accesRetire"; nomPage: string; compteId: string };

export function notificationsPour(
  fait: Fait,
  admins: readonly string[],
): Brouillon[] {
  switch (fait.type) {
    case "pageAcceptee":
      return [
        {
          destinataireId: fait.demandeurId,
          type: "pageCreee",
          params: { nom: fait.nomPage },
          lien: null,
        },
      ];
    case "demandeRefusee":
      return [
        {
          destinataireId: fait.demandeurId,
          type: "demandeRefusee",
          params: { nom: fait.nomPage, motif: fait.motif },
          lien: "/demande-page",
        },
      ];
    case "accesDonne":
      return [
        {
          destinataireId: fait.compteId,
          type: "accesDonne",
          params: { nom: fait.nomPage },
          lien: null,
        },
      ];
    case "accesRetire":
      return [
        {
          destinataireId: fait.compteId,
          type: "accesRetire",
          params: { nom: fait.nomPage },
          lien: null,
        },
      ];
    case "demandeDeposee":
      // Décision produit : chaque admin est notifié (garde-fou des 48 h).
      return admins.map((id) => ({
        destinataireId: id,
        type: "nouvelleDemande",
        params: { nom: fait.nomPage },
        lien: `/admin/demandes/${fait.demandeId}`,
      }));
  }
}
