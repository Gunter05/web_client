import "server-only";
import { compteCourant } from "@/features/auth/server";

/**
 * Garde serveur de l'espace Administration (US-07) : le rôle est porté par le
 * compte. Chaque page de l'espace l'appelle, en plus du layout.
 */
export async function adminCourant() {
  const compte = await compteCourant();
  return compte?.estAdmin ? compte : null;
}
