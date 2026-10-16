/** Actions suivies par les métriques du cadrage produit. */
export type TypeMesure =
  | "fiche_ouverte"
  | "arrivee_lien_partage"
  | "clic_partager"
  | "evenement_publie";

export type Mesure = {
  type: TypeMesure;
  evenementId?: string;
  visiteurId?: string;
  le: string;
};
