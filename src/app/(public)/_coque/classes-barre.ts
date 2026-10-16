/**
 * Visibilité dans la barre latérale : masqué quand la barre est réduite
 * (`data-reduite` sur la coque), visible quand elle s'étend au survol ou
 * au focus clavier.
 */
export const LIBELLE_BARRE =
  "whitespace-nowrap in-data-[reduite=true]:hidden in-[[data-reduite=true]_aside:hover]:inline in-[[data-reduite=true]_aside:focus-within]:inline";
export const BLOC_BARRE =
  "in-data-[reduite=true]:hidden in-[[data-reduite=true]_aside:hover]:block in-[[data-reduite=true]_aside:focus-within]:block";
