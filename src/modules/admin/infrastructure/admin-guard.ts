import "server-only";
import { getCurrentAccount } from "@/modules/auth/server";

/**
 * Garde serveur de l'espace Administration (US-07) : le rôle est porté par le
 * compte. Chaque page de l'espace l'appelle, en plus du layout.
 */
export async function getCurrentAdmin() {
  const account = await getCurrentAccount();
  return account?.isAdmin ? account : null;
}
