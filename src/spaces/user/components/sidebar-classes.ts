/**
 * Visibilité dans la barre latérale : masqué quand la barre est réduite
 * (`data-collapsed` sur la coque), visible quand elle s'étend au survol ou
 * au focus clavier (sauf juste après un clic sur « Réduire », voir CadreCoque).
 */
export const SIDEBAR_LABEL =
  "whitespace-nowrap in-data-[collapsed=true]:hidden in-[[data-collapsed=true]_aside[data-hover=enabled]:hover]:inline in-[[data-collapsed=true]_aside[data-hover=enabled]:focus-within]:inline";
export const SIDEBAR_BLOCK =
  "in-data-[collapsed=true]:hidden in-[[data-collapsed=true]_aside[data-hover=enabled]:hover]:block in-[[data-collapsed=true]_aside[data-hover=enabled]:focus-within]:block";
