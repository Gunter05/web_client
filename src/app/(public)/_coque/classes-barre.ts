/**
 * Visibilité dans la barre latérale : masqué quand la barre est réduite
 * (`data-reduite` sur la coque), visible quand elle s'étend au survol ou
 * au focus clavier (sauf juste après un clic sur « Réduire », voir CadreCoque).
 */
export const LIBELLE_BARRE =
  "whitespace-nowrap in-data-[reduite=true]:hidden in-[[data-reduite=true]_aside[data-survol=actif]:hover]:inline in-[[data-reduite=true]_aside[data-survol=actif]:focus-within]:inline";
export const BLOC_BARRE =
  "in-data-[reduite=true]:hidden in-[[data-reduite=true]_aside[data-survol=actif]:hover]:block in-[[data-reduite=true]_aside[data-survol=actif]:focus-within]:block";
